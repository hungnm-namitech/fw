import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CommercialFlow,
  Item,
  ProductDetail,
  ProductPrice,
  Supplier,
} from '@prisma/client';
import { addMonths, format } from 'date-fns';
import { UserJwt } from 'src/auth/auth.interface';
import { DEFAULT_FORMAT_DATE, USER_ROLE } from 'src/constants/common';
import { SRC_DATA_SAMPLE } from 'src/dataSample/data-sample.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { calculateItemVolume } from 'src/utils';
import { readDataFromExcel } from 'src/utils/read-file.xlsx';
import { IDataProductSample } from './products.interface';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async initializeProductData() {
    const dataItemGroups = await this.prismaService.product.count();
    if (!dataItemGroups) {
      const itemGroupsSheetConfig = {
        filePath: SRC_DATA_SAMPLE,
        sheetName: '製品',
        columns: [
          {
            nameObj: 'productCd',
            nameColumn: 'A',
          },
          {
            nameObj: 'productName',
            nameColumn: 'B',
          },
          {
            nameObj: 'productDisplayName',
            nameColumn: 'B',
          },
          {
            nameObj: 'itemCd',
            nameColumn: 'C',
          },
          {
            nameObj: 'supplierCd',
            nameColumn: 'D',
          },
          {
            nameObj: 'productId',
            nameColumn: 'E',
          },
          {
            nameObj: 'gradeStrength',
            nameColumn: 'F',
          },
          {
            nameObj: 'memo',
            nameColumn: 'G',
          },
          {
            nameObj: 'trailer',
            nameColumn: 'H',
          },
          {
            nameObj: 'capacityMin',
            nameColumn: 'I',
          },
          {
            nameObj: 'capacityMax',
            nameColumn: 'J',
          },
        ],
      };
      const dataSampleItemGroups = readDataFromExcel(itemGroupsSheetConfig);
      const responseOfItemGroups =
        await this.addProductSampleData(dataSampleItemGroups);

      return responseOfItemGroups;
    }
  }

  async addProductSampleData(products: IDataProductSample[]) {
    const createProductsQueries = products.map((item) => {
      return this.prismaService.product.create({
        data: {
          ...item,
          productCd: item.productCd.toString(),
          supplierCd: item.supplierCd.toString(),
          itemCd: item.itemCd.toString(),
          memo: item.memo,
          capacityMin: item.capacityMin
            ? item.capacityMin.toString()
            : item.capacityMin,
          capacityMax: item.capacityMax
            ? item.capacityMax.toString()
            : item.capacityMax,
          gradeStrength: '' + item.gradeStrength,
        },
      });
    });
    return this.prismaService
      .$transaction(createProductsQueries)
      .catch((error) => {
        console.error('Something error:', error);
        throw error;
      });
  }

  findProductByCd(productCd: string) {
    return this.prismaService.product.findUnique({
      where: {
        productCd,
      },
    });
  }

  async getItems(user: UserJwt) {
    if (!user.companyCd) return [];

    const items = await this.prismaService.item.findMany({
      where: {
        commercialFlows: {
          some: {
            companyCd: user.companyCd,
          },
        },
        products: {
          some: {},
        },
      },
      include: {
        commercialFlows: {
          where: {
            companyCd: user.companyCd,
          },
          include: {
            supplier: true,
          },
        },
      },
    });
    const formattedItems = items.reduce((acc, item) => {
      const formattedItem = this.formattedItem(item);
      acc.push(...formattedItem);
      return acc;
    }, []);
    return formattedItems;
  }

  formattedItem(
    item: Item & {
      commercialFlows: (CommercialFlow & { supplier: Supplier })[];
    },
  ) {
    const groupCommercialFlowsBySupplier = item.commercialFlows.reduce(
      (acc, commercialFlow) => {
        if (!acc[commercialFlow.supplierCd]) {
          acc[commercialFlow.supplierCd] = [commercialFlow];
        } else {
          acc[commercialFlow.supplierCd].push(commercialFlow);
        }
        return acc;
      },
      {},
    ) as { [key: string]: (CommercialFlow & { supplier: Supplier })[] };
    return Object.values(groupCommercialFlowsBySupplier).map(
      (commercialFlows) => ({
        id: item.itemCd,
        itemName: item.itemName,
        displayDiv: item.displayDiv,
        commercialFlows: commercialFlows.map((commercialFlow) => ({
          id: commercialFlow.commercialFlowCd,
          tradingCompany1: commercialFlow.tradingCompany1,
          tradingCompany2: commercialFlow.tradingCompany2,
          tradingCompany3: commercialFlow.tradingCompany3,
          tradingCompany4: commercialFlow.tradingCompany4,
          companyId: commercialFlow.companyCd,
        })),
        supplierName: commercialFlows[0].supplier.supplierName,
        supplierCd: commercialFlows[0].supplier.supplierCd,
      }),
    );
  }

  async getItemNames(user: UserJwt) {
    return this.prismaService.item
      .findMany({
        where: {
          products: {
            some: {
              supplierCd:
                user.roleDiv === USER_ROLE.SUPPLIER
                  ? user.supplierCd
                  : undefined,
            },
          },
          commercialFlows: {
            some: {
              companyCd:
                user.roleDiv === USER_ROLE.PC ? user.companyCd : undefined,
              supplierCd:
                user.roleDiv === USER_ROLE.SUPPLIER
                  ? user.supplierCd
                  : undefined,
            },
          },
        },
        select: {
          itemCd: true,
          itemName: true,
        },
      })
      .then((items) =>
        items.map((item) => ({
          id: item.itemCd,
          itemName: item.itemName,
        })),
      );
  }

  async getItemDetail(itemCd: string, commercialFlowCd: string, user: UserJwt) {
    const today = new Date();
    const firstDayOfMonth = new Date(
      format(
        new Date(today.getFullYear(), today.getMonth(), 1),
        DEFAULT_FORMAT_DATE,
      ),
    );
    const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);
    const item = await this.prismaService.item.findUnique({
      where: {
        itemCd,
      },
      include: {
        orderHeaders: {
          where: {
            temporaryFlag: false,
            createdAt: {
              gte: firstDayOfMonth,
              lt: firstDayOfNextMonth,
            },
            companyCd: user.companyCd,
          },
        },
        commercialFlows: {
          where: {
            commercialFlowCd,
            companyCd: user.companyCd,
          },
          include: {
            supplier: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Not found item group');
    }
    if (!item.commercialFlows.length) {
      throw new BadRequestException(`Can't get commercial_flow list`);
    }

    const commercialFlow = item.commercialFlows[0];

    const totalOrderQuantity = item.orderHeaders
      .filter((order) => order.supplierCd === commercialFlow.supplierCd)
      .reduce(
        (totalQuantity, { orderQuantity }) => totalQuantity + orderQuantity,
        0,
      );

    const products = await this.prismaService.product.findMany({
      where: {
        itemCd,
        supplierCd: commercialFlow.supplierCd,
      },
      select: {
        supplierCd: true,
        productDetails: true,
        productPrices: true,
        productDisplayName: true,
        productCd: true,
        productId: true,
        gradeStrength: true,
      },
    });

    if (!products.length) {
      throw new BadRequestException(`Item must have product list`);
    }

    const itemDetails = products
      .reduce((acc, product) => {
        const formattedProduct = product.productDetails.map(
          (productDetail) => ({
            productDisplayName: product.productDisplayName,
            productId: product.productId,
            gradeStrength: product.gradeStrength,
            productDetail,
            productPrices: product.productPrices,
          }),
        );
        acc.push(...formattedProduct);
        return acc;
      }, [])
      .map(({ productDetail, productPrices, ...product }) =>
        this.formatItemDetail(product, productDetail, productPrices),
      );

    return {
      itemName: item.itemName,
      monthlyForecast: commercialFlow.monthlyForecast,
      totalOrderQuantity,
      type: Number(item.displayDiv),
      itemDetails: itemDetails,
      supplier: commercialFlow.supplier,
    };
  }

  formatItemDetail(
    product: {
      productDisplayName: string;
      productId: number;
      gradeStrength: string;
    },
    productDetail: ProductDetail,
    productPrices: ProductPrice[],
  ) {
    // Current length is varchar => Confirming change to int
    const length = +productDetail.length;
    if (isNaN(length)) {
      throw new UnprocessableEntityException(`Can't convert length to number`);
    }
    // Get the record with the closest start_date before the current date
    const closestItemPrice = productPrices.find(
      (price) =>
        new Date(format(new Date(), DEFAULT_FORMAT_DATE)).getTime() >
        price.startDate.getTime(),
    );
    if (!closestItemPrice) {
      throw new UnprocessableEntityException(
        `Not found item prices have start_date before today`,
      );
    }
    const itemVolume = calculateItemVolume(
      productDetail.width,
      productDetail.thickness,
      length,
      productDetail.quantityPerPack,
      10,
    );
    return {
      ...productDetail,
      itemPrices: undefined,
      unitPrice: closestItemPrice.unitPrice,
      length,
      itemVolume,
      id: productDetail.productDetailCd,
      productId: product.productId,
      gradeStrength: product.gradeStrength,
      productName: product.productDisplayName,
    };
  }
}
