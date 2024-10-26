import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  Base,
  ChangeOrderDetail,
  ChangeOrderHeader,
  Item,
  OrderAction,
  OrderDetail,
  OrderHeader,
  Prisma,
  PrismaClient,
  Product,
  ProductDetail,
  Supplier,
} from '@prisma/client';
import { DefaultArgs, Sql } from '@prisma/client/runtime/library';
import { differenceBy, get, maxBy, omit, pick } from 'lodash';
import { UserJwt } from 'src/auth/auth.interface';
import { CompaniesService } from 'src/companies/companies.service';
import {
  DEFAULT_LIMIT_FOR_PAGINATION,
  DEFAULT_OFFSET,
  DEFAULT_ORDER_DIRECTION_DESC,
  USER_ROLE,
} from 'src/constants/common';
import { ProductDetailService } from 'src/product-details/product-details.service';
import { ProductService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import {
  calculateItemVolume,
  formatValueBeforeSaveDb,
  makeResponse,
} from 'src/utils';
import { ChangeDeliveryDateRequest } from './dto/request/change-delivery-request.dto';
import {
  CreateOrderDto,
  ProductDetailRequestDto,
} from './dto/request/create-order.dto';
import { OrderRequestValidationDto } from './dto/request/order-request-validation.dto';
import { RequestChangeOrderDto } from './dto/request/request-change-order.dto';
import { SearchOrderParams } from './dto/request/search-order-params.dto';
import {
  ACTIONS_NEED_CHECKING_READ_FOR_FW,
  ACTIONS_NEED_CHECKING_READ_FOR_PC,
  ACTIONS_NEED_CHECKING_READ_FOR_SUPPLIER,
  DEFAULT_ORDER_ACTION,
  FIELDS_REQUIRED_IF_ORDER_NOT_DRAF,
  MAPPING_ACTION_VALIDATION_REQUEST_WITH_ACTION_STATUS,
  MAP_ORDER_HEADER_ORDER_BY,
  ORDER_ACTION_CONFIRMATION,
  ORDER_ACTION_DIV,
  ORDER_HEADER_ORDER_BY,
  ORDER_STATUS_DIV,
  ORDER_VALIDATION_REQUEST,
} from './orders.constant';
import { BatchUpdateReplyDeadlineDto } from './dto/request/batch-update-reply-deadline.dto';
import { makeCommercialFlowId } from 'src/commercial-flows/commerical-flows.utils';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService,
    private productDetailService: ProductDetailService,
    private suppliersService: SuppliersService,
    private companiedService: CompaniesService,
  ) {}

  async findOrderHeaderById(id: number) {
    const orderHeader = await this.prismaService.orderHeader.findUnique({
      where: {
        id,
      },
      include: {
        orderDetails: true,
        supplier: true,
      },
    });
    if (!orderHeader) {
      throw new BadRequestException(`Not found order header`);
    }
    return orderHeader;
  }

  // TODO: Refactor logic order by
  async getOrderList(query: SearchOrderParams, currentUser: UserJwt) {
    const selectSql = Prisma.sql`
      SELECT o.id, 
        o.item_cd AS itemCd,
        i.item_name AS itemName,
        o.status_div AS statusDiv,
        oc.action_div AS actionDiv,
        o.created_at AS createdAt,
        o.updated_at AS updatedAt,
        o.order_quantity AS orderQuantity,
        o.destination_id AS destinationId,
        b.base_name AS baseName,
        o.reply_deadline AS replyDeadline,
        o.requested_deadline AS requestedDeadline,
        o.mixed_loading_flag AS mixedLoadingFlag,
        o.updated_by AS updatedBy,
        o.trading_company AS tradingCompany,
        sup.supplier_name AS supplierName,
        u1.user_name AS updatedByUserName,
        o.memo,
        co.order_quantity AS changeOrderQuantity,
        co.destination_id AS changeDestinationId,
        b1.base_name AS changeBaseName,
        co.reply_deadline AS changeReplyDeadline,
        co.requested_deadline AS changeRequestedDeadline,
        co.mixed_loading_flag AS changeMixedLoadingFlag,
        co.memo AS changeMemo,
        co.trading_company AS changeTradingCompany,
        sup1.supplier_name AS changeSupplierName,
        oc.memo AS actionMemo,
        oc.change_deadline AS changeDeadline,
        oc.action_div AS actionDiv,
        oc.confirmed_flag AS confirmedFlag,
        oc.id AS actionId,
        c.company_nm,
        b.base_name as destination_name,
        b1.base_name as change_order_destination_name
    `;
    const leftJoin = Prisma.sql`LEFT JOIN change_order_headers co ON co.order_id = o.id
    LEFT JOIN users u ON u.m_user_id = o.created_by
    LEFT JOIN users u1 ON u1.m_user_id = o.updated_by
    LEFT JOIN order_actions oc ON oc.order_id = o.id
    LEFT JOIN items i ON i.item_cd = o.item_cd
    LEFT JOIN companies c ON c.company_cd = o.company_cd
    LEFT JOIN bases b ON b.id = o.destination_id
    LEFT JOIN bases b1 ON b1.id = co.destination_id
    LEFT JOIN suppliers sup ON sup.supplier_cd = o.supplier_cd
    LEFT JOIN suppliers sup1 ON sup1.supplier_cd = co.supplier_cd
    `;
    const where = Prisma.sql`
      (
        co.id = (Select Max(id) from change_order_headers where change_order_headers.order_id = o.id) 
        OR co.id is null
      )
      ${query.id ? Prisma.sql` AND o.id = ${+query.id}` : Prisma.empty}
      ${this.buildLikeQueryToChangeOrderHeader('memo', query.memo)}
      ${
        query.itemCds
          ? Prisma.sql` AND o.item_cd IN (${Prisma.join(
              query.itemCds.split(','),
            )})`
          : Prisma.empty
      }
      ${
        query.companyCds
          ? Prisma.sql` AND (o.company_cd IN (${Prisma.join(
              query.companyCds.split(','),
            )}) OR co.company_cd IN (${Prisma.join(
              query.companyCds.split(','),
            )}))`
          : Prisma.empty
      }
      ${
        query.statuses
          ? Prisma.sql` AND o.status_div IN (${Prisma.join(
              query.statuses.split(','),
            )})`
          : Prisma.empty
      }
      ${this.buildQueryDate(
        'o.created_at',
        query.createdAtFrom,
        query.createdAtTo,
      )}
      ${this.buildQueryDate(
        'o.updated_at',
        query.updatedAtFrom,
        query.updatedAtTo,
      )}
      ${this.buildDateQueryToChangeOrderHeader(
        'reply_deadline',
        query.replyDeadlineFrom,
        query.replyDeadlineTo,
      )} ${this.buildDateQueryToChangeOrderHeader(
        'requested_deadline',
        query.requestedDeadlineFrom,
        query.requestedDeadlineTo,
      )} ${
        query.mixedLoadingFlag
          ? Prisma.sql` AND ((o.mixed_loading_flag = ${Boolean(
              +query.mixedLoadingFlag,
            )} AND ${
              currentUser.roleDiv === USER_ROLE.SUPPLIER
                ? Prisma.sql`o.status_div <> ${ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED.toString()}`
                : Prisma.sql`o.status_div <> ${ORDER_STATUS_DIV.CHANGE_REQUEST.toString()} AND
                o.status_div <> ${ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED.toString()}`
            })
             OR (co.mixed_loading_flag IS NULL AND o.mixed_loading_flag = ${Boolean(
               +query.mixedLoadingFlag,
             )})
             OR (co.mixed_loading_flag = ${Boolean(
               +query.mixedLoadingFlag,
             )} AND ${
               currentUser.roleDiv === USER_ROLE.SUPPLIER
                 ? Prisma.sql`o.status_div = ${ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED.toString()}`
                 : Prisma.sql`o.status_div IN (${ORDER_STATUS_DIV.CHANGE_REQUEST.toString()}, 
                 ${ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED.toString()})`
             }
            ))`
          : Prisma.empty
      }
    `;
    // Logic pagination
    const limit =
      +query.perPage > 0 ? +query.perPage : DEFAULT_LIMIT_FOR_PAGINATION;
    const offset = +query.offset >= 0 ? +query.offset * limit : DEFAULT_OFFSET;

    let conditionRole = Prisma.empty;
    switch (currentUser.roleDiv) {
      case USER_ROLE.PC:
        conditionRole = this.buildQueryOrdersForPc(query, currentUser);
        break;
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        conditionRole = this.buildQueryOrderForFw();
        break;
      case USER_ROLE.SUPPLIER:
        conditionRole = this.buildQueryOrderForSupplier(currentUser);
        break;
    }

    const data = (await this.prismaService.$queryRaw`${selectSql}
      FROM order_headers o
      ${leftJoin}
      WHERE ${where} ${conditionRole}
  `) as Array<{ [key: string]: any }>;
    // Group by order_id
    const orders = Object.values(
      data.reduce((acc, order) => {
        const action = {
          id: order.actionId,
          memo: order.memo,
          actionDiv: order.actionDiv,
          changeDeadline: order.changeDeadline,
          confirmedFlag: order.confirmedFlag,
        };
        if (!acc[order.id]) {
          acc[order.id] = {
            ...order,
            actions: action.id ? [action] : [],
          };
        } else {
          if (action.id) {
            acc[order.id].actions.push(action);
          }
        }
        return acc;
      }, {}),
    );
    const formattedData = orders
      .sort((a, b) => {
        if (query.sortBy) {
          return this.sortByField(
            this.formatBeforeSortOrderHeader(a, currentUser),
            this.formatBeforeSortOrderHeader(b, currentUser),
            query.sortBy,
            query.sortDir,
            currentUser,
          );
        }
        if (currentUser.roleDiv === USER_ROLE.PC) {
          if (
            +a.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED &&
            a.replyDeadline &&
            new Date(a.replyDeadline) <= new Date()
          ) {
            if (
              +b.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED &&
              b.replyDeadline &&
              new Date(b.replyDeadline) <= new Date()
            ) {
              return this.sortByReadAction(a, b, currentUser);
            } else {
              return -1;
            }
          }
          if (
            +b.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED &&
            b.replyDeadline &&
            new Date(b.replyDeadline) <= new Date()
          ) {
            if (
              +a.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED &&
              a.replyDeadline &&
              new Date(a.replyDeadline) <= new Date()
            ) {
              return this.sortByReadAction(a, b, currentUser);
            } else {
              return 1;
            }
          }
        }

        return this.sortByReadAction(a, b, currentUser);
      })
      .map((item) => {
        let formattedValue = pick(item, [
          'id',
          'itemName',
          'statusDiv',
          'createdAt',
          'updatedAt',
          'orderQuantity',
          'destinationId',
          'replyDeadline',
          'requestedDeadline',
          'memo',
          'mixedLoadingFlag',
          'actionDiv',
          'updatedByUserName',
          'updatedBy',
          'baseName',
          'tradingCompany',
          'supplierName',
          'destination_name',
          'change_ordder_destination_name',
        ]);

        if (
          ([
            ORDER_STATUS_DIV.CHANGE_REQUEST,
            ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED,
          ].includes(+item.statusDiv) &&
            currentUser.roleDiv !== USER_ROLE.SUPPLIER) ||
          (+item.statusDiv ===
            ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED &&
            currentUser.roleDiv === USER_ROLE.SUPPLIER)
        ) {
          formattedValue = {
            ...formattedValue,
            mixedLoadingFlag:
              item.changeMixedLoadingFlag ?? item.mixedLoadingFlag,
            orderQuantity: item.changeOrderQuantity ?? item.orderQuantity,
            destinationId: item.changeDestinationId ?? item.destinationId,
            replyDeadline: item.changeReplyDeadline ?? item.replyDeadline,
            supplierName: item.changeSupplierName ?? item.supplierName,
            tradingCompany: item.changeTradingCompany ?? item.tradingCompany,
            baseName: item.changeBaseName ?? item.baseName,
            requestedDeadline:
              item.changeRequestedDeadline ?? item.requestedDeadline,
          };
        }
        const actions = (item.actions || []) as OrderAction[];
        const lastAction: OrderAction | undefined = this.getLastAction(actions);
        return {
          ...formattedValue,
          company_nm: item.company_nm,
          actionDiv: lastAction?.actionDiv,
          isRead: this.isReadOrderByUser(item.actions, currentUser),
          memo: item.memo ?? item.changeMemo ?? item.actionMemo,
          replyDeadline:
            ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST === +item.statusDiv &&
            currentUser.roleDiv !== USER_ROLE.PC
              ? lastAction?.changeDeadline
              : formattedValue.replyDeadline,
        };
      })
      .filter((item, index) => {
        return index > offset - 1 && index < offset + limit;
      });
    return {
      items: formattedData,
      total: orders.length,
      perPage: limit,
      currentPage: +query.offset >= 0 ? +query.offset + 1 : DEFAULT_OFFSET + 1,
    };
  }

  sortByField(
    a: any,
    b: any,
    sortBy: ORDER_HEADER_ORDER_BY,
    sortDir = DEFAULT_ORDER_DIRECTION_DESC,
    currentUser: UserJwt,
  ) {
    const isDesc = sortDir === DEFAULT_ORDER_DIRECTION_DESC ? true : false;
    const configField = MAP_ORDER_HEADER_ORDER_BY[sortBy];
    const valueA = a[configField.field];
    const valueB = b[configField.field];
    if (valueA === null) {
      return isDesc ? 1 : -1;
    }
    if (valueB === null) {
      return isDesc ? -1 : 1;
    }
    let compare: number;
    if (sortBy === ORDER_HEADER_ORDER_BY.IS_READ) {
      compare =
        Number(this.isReadOrderByUser(b.actions, currentUser)) >=
        Number(this.isReadOrderByUser(a.actions, currentUser))
          ? 1
          : -1;
    } else if (sortBy === ORDER_HEADER_ORDER_BY.ACTION_DIV) {
      compare = this.compareLastAction(a, b);
    } else if (configField.type === Date) {
      compare = new Date(valueB) >= new Date(valueA) ? 1 : -1;
    } else if (configField.type === Number) {
      compare = Number(valueB || 0) >= Number(valueA || 0) ? 1 : -1;
    } else if (configField.type === String) {
      compare = valueB >= valueA ? 1 : -1;
    } else if (configField.type === Boolean) {
      compare = Number(valueB) >= Number(valueA) ? 1 : -1;
    }
    return isDesc ? 1 * compare : -1 * compare;
  }

  compareLastAction(
    a: { actions: OrderAction[] },
    b: { actions: OrderAction[] },
  ) {
    const lastActionA = this.getLastAction(a.actions);
    const lastActionB = this.getLastAction(b.actions);
    return (
      Number(lastActionB?.actionDiv || 0) - Number(lastActionA?.actionDiv || 0)
    );
  }

  getLastAction(actions: OrderAction[]) {
    return maxBy(actions, 'id');
  }

  formatBeforeSortOrderHeader(
    orderHeader: OrderHeader & {
      changeMemo?: string;
      actionMemo?: string;
      changeMixedLoadingFlag?: boolean;
      changeOrderQuantity?: number;
      changeDestinationId?: number;
      changeReplyDeadline?: Date;
      changeRequestedDeadline?: Date;
      actions?: OrderAction[];
    },
    currentUser: UserJwt,
  ) {
    let formattedOrderHeader = {
      ...orderHeader,
      memo:
        orderHeader.memo ?? orderHeader.changeMemo ?? orderHeader.actionMemo,
    };
    if (
      ([
        ORDER_STATUS_DIV.CHANGE_REQUEST,
        ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED,
      ].includes(+orderHeader.statusDiv) &&
        currentUser.roleDiv !== USER_ROLE.SUPPLIER) ||
      (+orderHeader.statusDiv ===
        ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED &&
        currentUser.roleDiv === USER_ROLE.SUPPLIER)
    ) {
      formattedOrderHeader = {
        ...formattedOrderHeader,
        mixedLoadingFlag:
          orderHeader.changeMixedLoadingFlag ?? orderHeader.mixedLoadingFlag,
        orderQuantity:
          orderHeader.changeOrderQuantity ?? orderHeader.orderQuantity,
        destinationId:
          orderHeader.changeDestinationId ?? orderHeader.destinationId,
        replyDeadline:
          orderHeader.changeReplyDeadline ?? orderHeader.replyDeadline,
        requestedDeadline:
          orderHeader.changeRequestedDeadline ?? orderHeader.requestedDeadline,
      };
    }
    const actions = (orderHeader.actions || []) as OrderAction[];
    const lastAction: OrderAction | undefined = this.getLastAction(actions);
    return {
      ...formattedOrderHeader,
      replyDeadline:
        ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST ===
          +orderHeader.statusDiv && currentUser.roleDiv !== USER_ROLE.PC
          ? lastAction?.changeDeadline
          : formattedOrderHeader.replyDeadline,
    };
  }

  sortByUpdatedAt(
    a: { updatedAt: string | Date },
    b: { updatedAt: string | Date },
  ) {
    return new Date(b.updatedAt) >= new Date(a.updatedAt) ? 1 : -1;
  }

  sortByReadAction(a, b, currentUser: UserJwt) {
    const isReadActionsA = this.isReadOrderByUser(a.actions, currentUser);
    const isReadActionsB = this.isReadOrderByUser(b.actions, currentUser);

    if (isReadActionsA && !isReadActionsB) {
      return 1;
    }
    if (!isReadActionsA && isReadActionsB) {
      return -1;
    }
    if (
      (isReadActionsA && isReadActionsB) ||
      (!isReadActionsA && !isReadActionsB)
    ) {
      return this.sortByUpdatedAt(a, b);
    }
  }

  isReadOrderByUser(actions: OrderAction[], currentUser: UserJwt) {
    switch (currentUser.roleDiv) {
      case USER_ROLE.PC:
        return this.isReadOrder(actions, ACTIONS_NEED_CHECKING_READ_FOR_PC);
      case USER_ROLE.FW:
      case USER_ROLE.ADMIN:
        return this.isReadOrder(actions, ACTIONS_NEED_CHECKING_READ_FOR_FW);
      case USER_ROLE.SUPPLIER:
        return this.isReadOrder(
          actions,
          ACTIONS_NEED_CHECKING_READ_FOR_SUPPLIER,
        );
    }
  }

  isReadOrder(actions: OrderAction[], actionDivs: ORDER_ACTION_DIV[]) {
    return actions.every(
      (action) =>
        (actionDivs.includes(+action.actionDiv) &&
          Number(action.confirmedFlag) === 1) ||
        !actionDivs.includes(+action.actionDiv),
    );
  }

  buildQueryOrdersForPc(query: SearchOrderParams, currentUser: UserJwt) {
    return Prisma.sql` AND o.company_cd = ${currentUser.companyCd}`;
  }

  buildQueryOrderForFw(): Sql {
    return Prisma.sql` AND o.temporary_flag = ${false}`;
  }

  buildQueryOrderForSupplier(currentUser: UserJwt): Sql {
    return Prisma.sql`AND o.temporary_flag = ${false} AND sup.parent_supplier_cd = ${
      currentUser.supplierCd
    } AND o.status_div <> ${ORDER_STATUS_DIV.ORDER_NOT_CONFIRM.toString()}`;
  }

  buildLikeQueryToChangeOrderHeader(fieldName: string, value?: string): Sql {
    if (!value) {
      return Prisma.empty;
    }
    return Prisma.sql` AND (${Prisma.raw(
      'o.' + fieldName,
    )} LIKE ${`%${value.trim()}%`}
      OR ${Prisma.raw('co.' + fieldName)} LIKE  ${`%${value.trim()}%`}
    )`;
  }

  buildDateQueryToChangeOrderHeader(
    fieldName: string,
    from?: string | Date,
    to?: string | Date,
  ): Sql {
    if (!from && !to) {
      return Prisma.empty;
    }
    if (from && to) {
      return Prisma.sql` AND ((${Prisma.raw(
        'o.' + fieldName,
      )} >= ${from} AND ${Prisma.raw('o.' + fieldName)} <= ${to}) OR 
        (${Prisma.raw('co.' + fieldName)} >= ${from} AND ${Prisma.raw(
          'co.' + fieldName,
        )} <= ${to}))`;
    }
    if (from && !to) {
      return Prisma.sql` AND (${Prisma.raw(
        'o.' + fieldName,
      )} >= ${from} OR ${Prisma.raw('co.' + fieldName)} >= ${from})`;
    }
    return Prisma.sql` AND (${Prisma.raw(
      'o.' + fieldName,
    )} <= ${to} OR ${Prisma.raw('co.' + fieldName)} <= ${to})`;
  }

  buildQueryDate(
    fieldName: string,
    from?: string | Date,
    to?: string | Date,
  ): Sql {
    if (from && to) {
      return Prisma.sql` AND (${Prisma.raw(
        fieldName,
      )} >= ${from} AND ${Prisma.raw(fieldName)} <= ${to})`;
    }
    if (!from && !to) {
      return Prisma.empty;
    }
    if (from && !to) {
      return Prisma.sql` AND ${Prisma.raw(fieldName)} >= ${from}`;
    }
    return Prisma.sql` AND ${Prisma.raw(fieldName)} <= ${to}`;
  }

  calculateOrderQuantity(
    productDetails: (ProductDetail & { quantity: number })[],
  ) {
    return Number(
      productDetails
        .reduce((totalQuantity, productDetail) => {
          return +(
            totalQuantity +
            Number(
              calculateItemVolume(
                productDetail.width,
                productDetail.thickness,
                +productDetail.length,
                productDetail.quantityPerPack,
                10,
              ) * productDetail.quantity,
            )
          );
        }, 0)
        .toFixed(4),
    );
  }

  async createOrder(body: CreateOrderDto, currentUser: UserJwt) {
    await this.checkItemCdAndSupplierCd(body.itemCd, body.supplierCd);
    await this.checkVehicleClassDiv(body.vehicleClassDiv);
    if (body.temporaryFlag === false) {
      FIELDS_REQUIRED_IF_ORDER_NOT_DRAF.forEach((field) => {
        if (body[field] === undefined) {
          throw new BadRequestException(`${field} should not be empty`);
        }
      });
      if (!body.productDetails) {
        throw new BadRequestException(`Product details should not be empty`);
      }
    }

    let productDetails: (ProductDetail & { product: Product })[] = [];
    if (body.productDetails) {
      productDetails =
        await this.productDetailService.getListProductDetailByCds(
          body.productDetails.map(({ productDetailCd }) => productDetailCd),
        );
      if (!productDetails.length) {
        throw new BadRequestException('Not found item detail');
      }
      const isValidItemDetails = productDetails.every(
        (itemDetail) => body.itemCd === itemDetail.product.itemCd,
      );
      if (!isValidItemDetails) {
        throw new BadRequestException(
          'The list of items must belong to the same group',
        );
      }
    }

    if (body.destinationId) {
      const base = await this.companiedService.findBaseById(body.destinationId);
      if (!base) {
        throw new BadRequestException(`Not found destination info`);
      }
    }

    await this.prismaService.$transaction(async (trx) => {
      const orderQuantity = this.calculateOrderQuantity(
        productDetails.map((productDetail, index) => ({
          ...productDetail,
          quantity: body.productDetails[index].quantity,
        })),
      );
      const orderDetails = body.productDetails
        ? body.productDetails.map((productDetail) => ({
            quantity: productDetail.quantity,
            productDetailCd: productDetail.productDetailCd,
          }))
        : [];

      const orderHeader = await trx.orderHeader.create({
        data: {
          ...omit(body, ['productDetails']),
          staffId: body.staffId,
          itemCd: body.itemCd,
          supplierCd: body.supplierCd,
          companyCd: currentUser.companyCd,
          createdBy: currentUser.mUserId,
          updatedBy: currentUser.mUserId,
          requestedDeadline: body.requestedDeadline
            ? new Date(body.requestedDeadline)
            : null,
          statusDiv: ORDER_STATUS_DIV.ORDER_NOT_CONFIRM.toString(),
          orderQuantity,
          orderDetails: {
            createMany: {
              data: orderDetails,
            },
          },
        },
      });
      if (body.temporaryFlag === false) {
        await this.createOrderAction(
          {
            orderHeaderId: orderHeader.id,
            actionDiv: ORDER_ACTION_DIV.ORDER_CONFIRMATION.toString(),
            statusDiv: ORDER_STATUS_DIV.ORDER_NOT_CONFIRM.toString(),
            memo: body.memo,
            closeFlag: false,
            confirmedFlag: false,
          },
          currentUser,
          trx,
        );
      }
    });
    return makeResponse(HttpStatus.CREATED);
  }

  async checkItemCdAndSupplierCd(itemCd?: string, supplierCd?: string) {
    if (itemCd) {
      const item = await this.prismaService.item.findUnique({
        where: {
          itemCd,
        },
      });
      if (!item) {
        throw new BadRequestException(`Itemcd not valid`);
      }
    }
    if (supplierCd) {
      const supplier = await this.prismaService.supplier.findUnique({
        where: {
          supplierCd,
        },
      });
      if (!supplier) {
        throw new BadRequestException(`SupplierCd not valid`);
      }
    }
  }

  async checkVehicleClassDiv(vehicleClassDiv?: string) {
    if (vehicleClassDiv) {
      const divValue = await this.prismaService.divValues.findFirst({
        where: {
          divValue: vehicleClassDiv,
        },
      });
      if (!divValue) {
        throw new BadRequestException('Not found div value');
      }
    }
  }

  async updateOrderByPc(
    body: RequestChangeOrderDto,
    orderHeaderId: number,
    currentUser: UserJwt,
  ) {
    const orderHeader = await this.findOrderHeaderById(orderHeaderId);
    await this.checkItemCdAndSupplierCd(body.itemCd, body.supplierCd);
    await this.checkVehicleClassDiv(body.vehicleClassDiv);
    if (body.temporaryFlag === false) {
      FIELDS_REQUIRED_IF_ORDER_NOT_DRAF.forEach((field) => {
        if (body[field] === undefined && orderHeader[field] === null) {
          throw new BadRequestException(`${field} should not be empty`);
        }
      });
    }
    if (body.destinationId) {
      const base = await this.companiedService.findBaseById(body.destinationId);
      if (!base) {
        throw new BadRequestException(`Not found destination info`);
      }
    }

    if (
      [
        ORDER_STATUS_DIV.CANCELLATION_REQUEST,
        ORDER_STATUS_DIV.CHANGE_REQUEST,
      ].includes(+body.statusDiv)
    ) {
      const orderAction = await this.prismaService.orderAction.findFirst({
        where: {
          orderHeaderId,
          actionDiv: ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE.toString(),
          closeFlag: false,
        },
      });
      if (orderAction) {
        throw new BadRequestException(
          `Supplier is creating a delivery date change order`,
        );
      }
    }

    const productDetails = body.productDetails
      ? await this.productDetailService.getListProductDetailByCds(
          body.productDetails.map((item) => item.productDetailCd),
        )
      : undefined;
    const updatingOrderHeader = {
      ...omit(body, ['productDetails']),
      requestedDeadline: !!body.requestedDeadline
        ? new Date(body.requestedDeadline)
        : null,
      orderQuantity: body.productDetails
        ? this.calculateOrderQuantity(
            productDetails.map((itemDetail, index) => ({
              ...itemDetail,
              quantity: body.productDetails[index].quantity,
            })),
          )
        : undefined,
    };
    const creatingOrderAction = {
      orderHeaderId: orderHeader.id,
      memo: body.memo,
      closeFlag: false,
      confirmedFlag: false,
      statusDiv: body.statusDiv,
    };
    const creatingChangeOrderHeader = {
      ...updatingOrderHeader,
      companyCd: currentUser.companyCd,
      orderHeaderId: orderHeader.id,
      itemCd: body.itemCd || orderHeader.itemCd,
      supplierCd: body.supplierCd || orderHeader.supplierCd,
    };
    await this.prismaService.$transaction(async (trx) => {
      switch (true) {
        case +body.statusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM &&
          body.temporaryFlag === true:
          await this.updateOrderHeaderById(
            orderHeader.id,
            updatingOrderHeader,
            currentUser,
            trx,
          );
          await this.updateOrderDetails(
            orderHeader.orderDetails,
            orderHeaderId,
            body,
            trx,
          );
          break;
        case +body.statusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM &&
          body.temporaryFlag === false:
          await this.updateOrderHeaderById(
            orderHeader.id,
            updatingOrderHeader,
            currentUser,
            trx,
          );
          await this.updateOrderDetails(
            orderHeader.orderDetails,
            orderHeaderId,
            body,
            trx,
          );
          await this.createOrderAction(
            {
              ...creatingOrderAction,
              actionDiv: ORDER_ACTION_DIV.ORDER_CONFIRMATION.toString(),
            },
            currentUser,
            trx,
          );
          break;
        case +body.statusDiv === ORDER_STATUS_DIV.CHANGE_REQUEST &&
          body.temporaryFlag === false:
          await trx.orderAction.updateMany({
            where: {
              actionDiv: ORDER_ACTION_DIV.ORDER_CHANGE.toString(),
              orderHeaderId,
              closeFlag: false,
            },
            data: {
              closeFlag: true,
            },
          });
          await this.updateOrderHeaderById(
            orderHeader.id,
            { statusDiv: body.statusDiv },
            currentUser,
            trx,
          );
          const changeOrderHeader = await this.createChangeOrderHeader(
            creatingChangeOrderHeader,
            trx,
          );
          await this.createChangeOrderDetails(
            body.productDetails || [],
            changeOrderHeader,
            trx,
          );
          await this.createOrderAction(
            {
              ...creatingOrderAction,
              actionDiv: ORDER_ACTION_DIV.ORDER_CHANGE.toString(),
              changeOrderId: changeOrderHeader.id,
            },
            currentUser,
            trx,
          );
          break;
        case +body.statusDiv === ORDER_STATUS_DIV.CANCELLATION_REQUEST &&
          body.temporaryFlag === false:
          if (orderHeader.temporaryFlag === true) {
            await this.updateOrderHeaderById(
              orderHeader.id,
              {
                statusDiv: ORDER_STATUS_DIV.CANCELED.toString(),
                temporaryFlag: false,
              },
              currentUser,
              trx,
            );
            await this.createOrderAction(
              {
                ...creatingOrderAction,
                actionDiv: ORDER_ACTION_DIV.CANCELLATION.toString(),
                statusDiv: ORDER_STATUS_DIV.CANCELED.toString(),
                closeFlag: true,
              },
              currentUser,
              trx,
            );
            break;
          }
          const findedActionCancel = await trx.orderAction.findFirst({
            where: {
              orderHeaderId,
              closeFlag: false,
              actionDiv: ORDER_ACTION_DIV.CANCELLATION.toString(),
            },
          });
          if (findedActionCancel) {
            throw new BadRequestException(
              `Can't create 2 cancellation orders at the same time`,
            );
          }
          await this.updateOrderHeaderById(
            orderHeader.id,
            { statusDiv: body.statusDiv, temporaryFlag: false },
            currentUser,
            trx,
          );
          await this.createOrderAction(
            {
              ...creatingOrderAction,
              actionDiv: ORDER_ACTION_DIV.CANCELLATION.toString(),
            },
            currentUser,
            trx,
          );
          break;
        case +body.statusDiv === ORDER_STATUS_DIV.CANCELLATION_REQUEST &&
          body.temporaryFlag === true:
          const changeOrderHeaders = await trx.changeOrderHeader.findMany({
            where: {
              orderHeaderId: orderHeader.id,
            },
            select: {
              id: true,
              changeOrderDetails: true,
            },
          });
          const changeOrderDetails = changeOrderHeaders.reduce(
            (acc, changeOrderHeader) => {
              acc.push(...changeOrderHeader.changeOrderDetails);
              return acc;
            },
            [],
          );
          const orderActions = await trx.orderAction.findMany({
            where: {
              orderHeaderId,
            },
          });
          // Delete order details
          await this.deleteRecords(
            orderHeader.orderDetails,
            'orderDetail',
            trx,
          );
          await this.deleteRecords(
            changeOrderDetails,
            'changeOrderDetail',
            trx,
          );
          await this.deleteRecords(orderActions, 'orderAction', trx);
          await this.deleteRecords(
            changeOrderHeaders,
            'changeOrderHeader',
            trx,
          );
          await trx.orderHeader.delete({
            where: {
              id: orderHeaderId,
            },
          });
          break;
        case +body.statusDiv === ORDER_STATUS_DIV.DELIVERED &&
          body.temporaryFlag === false:
          await this.updateOrderHeaderById(
            orderHeader.id,
            { statusDiv: body.statusDiv },
            currentUser,
            trx,
          );
          await this.createOrderAction(
            {
              ...creatingOrderAction,
              actionDiv: ORDER_ACTION_DIV.COMPLETE_DELIVERY.toString(),
            },
            currentUser,
            trx,
          );
          break;
        default:
          throw new BadRequestException(`Status and temporaryFlag not valid`);
      }
    });

    return makeResponse(HttpStatus.OK);
  }

  deleteRecords(
    records: { id: number | bigint }[],
    table: string,
    trx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    if (!records.length) return [];
    return trx[table].deleteMany({
      where: { id: { in: records.map(({ id }) => id) } },
    });
  }

  updateOrderHeaderById(
    id: number,
    updatingData: Partial<OrderHeader>,
    currentUser: UserJwt,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    return prisma.orderHeader.update({
      where: {
        id,
      },
      // TODO: Add request transform to remove unknown fields
      data: {
        ...updatingData,
        updatedBy: currentUser.mUserId,
        itemCd: undefined,
        id: undefined,
        supplierCd: undefined,
      },
    });
  }

  // Update, create or delete order_details
  async updateOrderDetails(
    currentOrderDetails: OrderDetail[],
    orderHeaderId: number,
    body: RequestChangeOrderDto,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    const itemDetailsMap = new Map();
    (body.productDetails || []).forEach((item) => {
      itemDetailsMap.set(item.productDetailCd, item);
    });

    const deletingOrderDetailIds = differenceBy(
      currentOrderDetails,
      body.productDetails,
      'productDetailCd',
    ).map((item) => item.id);

    const creatingOrderDetails = differenceBy(
      body.productDetails,
      currentOrderDetails,
      'productDetailCd',
    ).map((item) => ({ ...item, orderHeaderId }));

    const updatingOrderDetails = currentOrderDetails
      .filter((item) => itemDetailsMap.has(item.productDetailCd))
      .map((item) => ({
        where: {
          id: item.id,
        },
        data: { quantity: itemDetailsMap.get(item.productDetailCd).quantity },
      }));

    await Promise.all(
      updatingOrderDetails.map((data) => prisma.orderDetail.update(data)),
    );
    await prisma.orderDetail.createMany({
      data: creatingOrderDetails,
    });
    await prisma.orderDetail.deleteMany({
      where: {
        id: {
          in: deletingOrderDetailIds,
        },
      },
    });
  }

  // Create order action
  getDefaultOrderAction(
    orderHeaderId: number,
    memo?: string,
    companyName?: string,
  ): DEFAULT_ORDER_ACTION {
    return {
      orderHeaderId,
      memo,
      closeFlag: false,
      confirmedFlag: false,
      companyName: companyName ? companyName : 'ファーストウッド',
    };
  }
  async createOrderAction(
    data: Pick<
      OrderAction,
      'actionDiv' | 'statusDiv' | 'closeFlag' | 'orderHeaderId' | 'memo'
    > & {
      companyName?: string;
      confirmedFlag?: boolean;
      changeDeadline?: Date;
      changeOrderId?: bigint;
    },
    currentUser: UserJwt,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    const company = data.companyName
      ? { companyName: data.companyName }
      : await prisma.company.findUnique({
          where: {
            companyCd: currentUser.companyCd,
          },
          select: {
            companyName: true,
          },
        });
    await prisma.orderAction.create({
      data: {
        ...data,
        companyName: company.companyName,
        userName: currentUser.username,
      },
    });
  }

  // Create change order header
  async createChangeOrderHeader(
    data: Partial<ChangeOrderHeader> & {
      orderHeaderId: number;
      itemCd: string;
      companyCd: string;
      supplierCd: string;
    },
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    return prisma.changeOrderHeader.create({
      data,
    });
  }

  // Create change order details
  async createChangeOrderDetails(
    productDetails: ProductDetailRequestDto[],
    changeOrderHeader: ChangeOrderHeader,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    return prisma.changeOrderDetail.createMany({
      data: productDetails.map((productDetail) => ({
        ...productDetail,
        changeOrderId: changeOrderHeader.id,
        orderHeaderId: changeOrderHeader.orderHeaderId,
      })),
    });
  }

  async changeDeliveryDateRequest(
    body: ChangeDeliveryDateRequest,
    orderId: number,
    currentUser: UserJwt,
  ) {
    const orderHeader = await this.findOrderHeaderById(orderId);
    if (orderHeader.supplier.parentSupplierCd !== currentUser.supplierCd) {
      throw new ForbiddenException(
        `Supplier don't have permission update order_id = ${orderId}`,
      );
    }

    const orderAction = await this.prismaService.orderAction.findFirst({
      where: {
        orderHeaderId: orderId,
        actionDiv: {
          in: [
            ORDER_ACTION_DIV.CANCELLATION.toString(),
            ORDER_ACTION_DIV.ORDER_CHANGE.toString(),
          ],
        },
        closeFlag: false,
      },
    });
    if (orderAction) {
      throw new BadRequestException(
        `Company is creating a ${
          +orderAction.actionDiv === ORDER_ACTION_DIV.CANCELLATION
            ? 'cancel'
            : 'change'
        } order`,
      );
    }

    const supplier = await this.prismaService.supplier.findUnique({
      where: {
        supplierCd: currentUser.supplierCd,
      },
    });

    await this.prismaService.$transaction(async (trx) => {
      // Create order_action: status_div = DELIVERY_DATE_CHANGE_REQUEST
      await this.updateOrderHeaderById(
        orderId,
        {
          statusDiv: ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST.toString(),
        },
        currentUser,
        trx,
      );
      // Update order status to DELIVERY_DATE_CHANGE_REQUEST
      await this.createOrderAction(
        {
          orderHeaderId: orderHeader.id,
          memo: body.memo,
          closeFlag: false,
          confirmedFlag: false,
          actionDiv: ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE.toString(),
          statusDiv: ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST.toString(),
          companyName: supplier.supplierName,
          changeDeadline: new Date(body.changeDealine),
        },
        currentUser,
        trx,
      );
    });
    return makeResponse(HttpStatus.OK);
  }

  async admiValidationRequest(
    body: OrderRequestValidationDto,
    orderId: number,
    currentUser: UserJwt,
  ) {
    const orderHeader = await this.findOrderHeaderById(orderId);
    if (orderHeader.temporaryFlag === true) {
      throw new BadRequestException(`Order is still in draft`);
    }
    const creatingOrderAction = this.getDefaultOrderAction(orderId, body.memo);
    switch (+orderHeader.statusDiv) {
      // Admin confirm request create order:
      case ORDER_STATUS_DIV.ORDER_NOT_CONFIRM:
        await this.adminConfirmCreateOrder(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      // Admin confirm request update delivery date of supplier:
      case ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST:
        await this.adminConfirmDeliveryDateChange(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      // Admin confirm request cancel:
      case ORDER_STATUS_DIV.CANCELLATION_REQUEST:
        await this.adminConfirmCancellationRequest(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      // Admin confirm request update order:
      case ORDER_STATUS_DIV.CHANGE_REQUEST:
        await this.adminConfirmChangeOrder(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      default:
        throw new BadRequestException(
          `Can't do the action with current order status`,
        );
    }
    return makeResponse(HttpStatus.OK);
  }

  async adminConfirmCreateOrder(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderId: number,
    currentUser: UserJwt,
  ) {
    await this.prismaService.$transaction(async (trx) => {
      let statusDiv: string;
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        statusDiv = ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED.toString();
        await this.updateOrderHeaderById(
          orderId,
          { statusDiv },
          currentUser,
          trx,
        );
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            statusDiv,
            actionDiv: ORDER_ACTION_DIV.APPROVAL.toString(),
          },
          currentUser,
          trx,
        );
        return;
      }
      statusDiv = ORDER_STATUS_DIV.ORDER_NOT_CONFIRM.toString();
      await this.updateOrderHeaderById(
        orderId,
        { statusDiv, temporaryFlag: true },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          statusDiv,
          actionDiv: ORDER_ACTION_DIV.REJECTION.toString(),
          closeFlag: true,
        },
        currentUser,
        trx,
      );
      await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CREATE_ORDER,
        ORDER_ACTION_CONFIRMATION.REFUSE,
        orderId,
        currentUser,
        trx,
      );
    });
  }

  async adminConfirmDeliveryDateChange(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderId: number,
    currentUser: UserJwt,
  ) {
    await this.prismaService.$transaction(async (trx) => {
      const statusDiv = ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED.toString();
      const lastActionsIsClosed = await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_DELIVERY_DATE_CHANGE,
        ORDER_ACTION_CONFIRMATION.ACCEPT,
        orderId,
        currentUser,
        trx,
      );
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        await this.updateOrderHeaderById(
          orderId,
          {
            statusDiv,
            replyDeadline: new Date(lastActionsIsClosed.changeDeadline),
          },
          currentUser,
          trx,
        );
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            actionDiv:
              ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_APPROVAL.toString(),
            statusDiv,
            closeFlag: true,
          },
          currentUser,
          trx,
        );
        return;
      }
      await this.updateOrderHeaderById(
        orderId,
        { statusDiv },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          actionDiv: ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_REJECTION.toString(),
          statusDiv,
          closeFlag: true,
        },
        currentUser,
        trx,
      );
    });
  }

  // TODO: Refactor
  adminConfirmCancellationRequest(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderHeaderId: number,
    currentUser: UserJwt,
  ) {
    return this.prismaService.$transaction(async (trx) => {
      let statusDiv: string;
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        statusDiv = ORDER_STATUS_DIV.CANCELLATION_APPROVED.toString();
        // Create order_action with close_flag = false
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            actionDiv: ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW.toString(),
            statusDiv,
          },
          currentUser,
          trx,
        );
        // Update order_header.status to CANCELLATION_APPROVED
        await this.updateOrderHeaderById(
          orderHeaderId,
          { statusDiv },
          currentUser,
          trx,
        );
        return;
      }
      const lastActionsIsClosed = await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CANCELLATION_REQUEST,
        ORDER_ACTION_CONFIRMATION.REFUSE,
        orderHeaderId,
        currentUser,
        trx,
      );
      // Get lastest action before lastActionsIsClosed
      const action = await trx.orderAction.findFirst({
        where: {
          orderHeaderId,
          id: {
            lt: lastActionsIsClosed.id,
          },
        },
        orderBy: {
          actionDatetime: 'desc',
        },
      });
      statusDiv = action.statusDiv;
      await this.updateOrderHeaderById(
        orderHeaderId,
        { statusDiv },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          statusDiv,
          actionDiv: ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_FW.toString(),
          closeFlag: true,
        },
        currentUser,
        trx,
      );
    });
  }

  // TODO: Refactor
  adminConfirmChangeOrder(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderId: number,
    currentUser: UserJwt,
  ) {
    return this.prismaService.$transaction(async (trx) => {
      let statusDiv: string;
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        statusDiv =
          ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED.toString();
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            actionDiv: ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW.toString(),
            statusDiv,
          },
          currentUser,
          trx,
        );
        await this.updateOrderHeaderById(
          orderId,
          { statusDiv },
          currentUser,
          trx,
        );
        return;
      }
      const closetAction = await this.getClosetOrderActionBeforeActionDiv(
        orderId,
        ORDER_ACTION_DIV.ORDER_CHANGE,
      );
      statusDiv = closetAction.statusDiv;
      await this.updateOrderHeaderById(
        orderId,
        { statusDiv },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          statusDiv,
          actionDiv: ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_FW.toString(),
          closeFlag: true,
        },
        currentUser,
        trx,
      );
      await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CHANGE_ORDER,
        ORDER_ACTION_CONFIRMATION.REFUSE,
        orderId,
        currentUser,
        trx,
      );
    });
  }

  async supplierValidationRequest(
    body: OrderRequestValidationDto,
    orderId: number,
    currentUser: UserJwt,
  ) {
    const orderHeader = await this.findOrderHeaderById(orderId);
    if (orderHeader.supplier.parentSupplierCd !== currentUser.supplierCd) {
      throw new ForbiddenException(
        `Supplier don't have permission update order_id = ${orderId}`,
      );
    }
    const supplier = await this.suppliersService.findBySupplierId(
      currentUser.supplierCd,
    );
    const creatingOrderAction = this.getDefaultOrderAction(
      orderId,
      body.memo,
      supplier.supplierName,
    );
    switch (+orderHeader.statusDiv) {
      // Supplier confirm request create order
      case ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED:
        await this.supplierConfirmCreateOrder(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      // Supplier confirm request cancel:
      case ORDER_STATUS_DIV.CANCELLATION_APPROVED:
        await this.supplierConfirmCancellationRequest(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      // Supplier confirm request update order:
      case ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED:
        await this.supplierConfirmChangeOrder(
          body,
          creatingOrderAction,
          orderId,
          currentUser,
        );
        break;
      default:
        throw new BadRequestException(
          `Can't do the action with current order status`,
        );
    }
    return makeResponse(HttpStatus.OK);
  }

  async supplierConfirmCreateOrder(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderId: number,
    currentUser: UserJwt,
  ) {
    if (!body.deadlineDate) {
      throw new BadRequestException(`Deadline date is required`);
    }
    await this.prismaService.$transaction(async (trx) => {
      const statusDiv = ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED.toString();
      // Update order_header.status to DELIVERY_DATE_CONFIRMED
      await this.updateOrderHeaderById(
        orderId,
        { statusDiv, replyDeadline: new Date(body.deadlineDate) },
        currentUser,
        trx,
      );
      // Create order_action with close_flag = true
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          closeFlag: true,
          statusDiv,
          actionDiv: ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE.toString(),
        },
        currentUser,
        trx,
      );
      await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CREATE_ORDER,
        ORDER_ACTION_CONFIRMATION.ACCEPT,
        orderId,
        currentUser,
        trx,
      );
      // Update close_flag order_action which type action_div = 1 or action_div = 2 to true
    });
  }

  async supplierConfirmCancellationRequest(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderId: number,
    currentUser: UserJwt,
  ) {
    return this.prismaService.$transaction(async (trx) => {
      let statusDiv: string;
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        statusDiv = ORDER_STATUS_DIV.CANCELED.toString();
        await this.updateOrderHeaderById(
          orderId,
          { statusDiv },
          currentUser,
          trx,
        );
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            statusDiv,
            actionDiv:
              ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_SUPPLIER.toString(),
            closeFlag: true,
          },
          currentUser,
          trx,
        );
        await this.closeActionsOfRequestUpdate(
          ORDER_VALIDATION_REQUEST.CONFIRM_CANCELLATION_REQUEST,
          ORDER_ACTION_CONFIRMATION.ACCEPT,
          orderId,
          currentUser,
          trx,
        );
        return;
      }
      const closetActionBeforeCancel =
        await this.getClosetOrderActionBeforeActionDiv(
          orderId,
          ORDER_ACTION_DIV.CANCELLATION,
        );
      await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CANCELLATION_REQUEST,
        ORDER_ACTION_CONFIRMATION.REFUSE,
        orderId,
        currentUser,
        trx,
      );
      await this.updateOrderHeaderById(
        orderId,
        { statusDiv: closetActionBeforeCancel.statusDiv },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          statusDiv: closetActionBeforeCancel.statusDiv,
          actionDiv:
            ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_SUPPLIER.toString(),
          closeFlag: true,
        },
        currentUser,
        trx,
      );
    });
  }

  async supplierConfirmChangeOrder(
    body: OrderRequestValidationDto,
    creatingOrderAction: DEFAULT_ORDER_ACTION,
    orderHeaderId: number,
    currentUser: UserJwt,
  ) {
    return this.prismaService.$transaction(async (trx) => {
      let statusDiv: string;
      if (ORDER_ACTION_CONFIRMATION.ACCEPT === body.action) {
        if (!body.deadlineDate) {
          throw new BadRequestException(`Deadline date is required`);
        }
        statusDiv = ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED.toString();
        await this.createOrderAction(
          {
            ...creatingOrderAction,
            statusDiv,
            actionDiv:
              ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_SUPPLIER.toString(),
            closeFlag: true,
          },
          currentUser,
          trx,
        );
        const closetActionOrderChange =
          await this.findClosetOrderActionNotDoneByAction(
            orderHeaderId,
            ORDER_ACTION_DIV.ORDER_CHANGE,
            trx,
          );
        await this.closeActionsOfRequestUpdate(
          ORDER_VALIDATION_REQUEST.CONFIRM_CHANGE_ORDER,
          ORDER_ACTION_CONFIRMATION.ACCEPT,
          orderHeaderId,
          currentUser,
          trx,
        );
        const changeOrderHeader = await trx.changeOrderHeader.findUnique({
          where: {
            id: closetActionOrderChange.changeOrderId,
          },
          include: {
            changeOrderDetails: true,
          },
        });
        await this.updateOrderHeaderById(
          orderHeaderId,
          {
            statusDiv,
            ...formatValueBeforeSaveDb(changeOrderHeader, [
              'vehicleClassDiv',
              'destinationId',
              'mixedLoadingFlag',
              'staffId',
              'orderQuantity',
              'memo',
            ]),
            requestedDeadline: changeOrderHeader.requestedDeadline
              ? new Date(changeOrderHeader.requestedDeadline)
              : undefined,
            replyDeadline: new Date(body.deadlineDate),
          },
          currentUser,
          trx,
        );
        await trx.orderDetail.deleteMany({
          where: {
            orderHeaderId: orderHeaderId,
          },
        });
        await trx.orderDetail.createMany({
          data: changeOrderHeader.changeOrderDetails.map((item) => ({
            orderHeaderId,
            productDetailCd: item.productDetailCd,
            quantity: item.quantity,
          })),
        });
        return;
      }
      const closetActionBeforeChangeOrder =
        await this.getClosetOrderActionBeforeActionDiv(
          orderHeaderId,
          ORDER_ACTION_DIV.ORDER_CHANGE,
        );
      statusDiv = closetActionBeforeChangeOrder.statusDiv;
      await this.closeActionsOfRequestUpdate(
        ORDER_VALIDATION_REQUEST.CONFIRM_CHANGE_ORDER,
        ORDER_ACTION_CONFIRMATION.REFUSE,
        orderHeaderId,
        currentUser,
        trx,
      );
      await this.updateOrderHeaderById(
        orderHeaderId,
        { statusDiv },
        currentUser,
        trx,
      );
      await this.createOrderAction(
        {
          ...creatingOrderAction,
          statusDiv,
          actionDiv:
            ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_SUPPLIER.toString(),
          closeFlag: true,
        },
        currentUser,
        trx,
      );
    });
  }

  async closeActionsOfRequestUpdate(
    typeRequest: ORDER_VALIDATION_REQUEST,
    action: ORDER_ACTION_CONFIRMATION,
    orderHeaderId: number,
    currentUser: UserJwt,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    const config = MAPPING_ACTION_VALIDATION_REQUEST_WITH_ACTION_STATUS[
      typeRequest
    ].find(
      (item) =>
        item.actionBy.includes(+currentUser.roleDiv) && item.action === action,
    );
    const listActionsNeedClose = await prisma.orderAction.findMany({
      where: {
        actionDiv: {
          in: config.actionDiv.map((actionDiv) => actionDiv.toString()),
        },
        closeFlag: false,
        orderHeaderId,
      },
      select: {
        id: true,
        changeDeadline: true,
      },
    });
    await prisma.orderAction.updateMany({
      where: {
        id: {
          in: listActionsNeedClose.map(({ id }) => id),
        },
      },
      data: {
        closeFlag: true,
      },
    });
    return listActionsNeedClose.pop();
  }

  async getClosetOrderActionBeforeActionDiv(
    orderId: number,
    actionDiv: ORDER_ACTION_DIV,
  ) {
    const orderAction = await this.prismaService.orderAction.findFirst({
      where: {
        actionDiv: actionDiv.toString(),
        orderHeaderId: orderId,
        closeFlag: false,
      },
      orderBy: {
        actionDatetime: 'desc',
      },
    });
    return this.prismaService.orderAction.findFirst({
      where: {
        id: {
          lt: orderAction.id,
        },
        actionDiv: {
          not: actionDiv.toString(),
        },
      },
      orderBy: {
        actionDatetime: 'desc',
      },
    });
  }

  findClosetOrderActionNotDoneByAction(
    orderId: number,
    actionDiv: ORDER_ACTION_DIV,
    trx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const prisma = trx ? trx : this.prismaService;
    return prisma.orderAction.findFirst({
      where: {
        orderHeaderId: orderId,
        actionDiv: actionDiv.toString(),
        closeFlag: false,
      },
    });
  }

  async getOrderDetail(orderId: number, currentUser: UserJwt) {
    const order = await this.prismaService.orderHeader.findUnique({
      where: {
        id: orderId,
      },
      include: {
        changeOrderHeaders: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
          include: {
            changeOrderDetails: {
              select: {
                productDetail: {
                  include: {
                    product: {
                      select: {
                        gradeStrength: true,
                        productName: true,
                      },
                    },
                  },
                },
                quantity: true,
              },
            },
          },
        },
        orderActions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        company: {
          select: {
            companyName: true,
          },
        },
        supplier: true,
        item: true,
        createdByUser: true,
        orderDetails: {
          select: {
            productDetail: {
              select: {
                product: {
                  select: {
                    gradeStrength: true,
                    productName: true,
                  },
                },
                thickness: true,
                length: true,
                quantityPerPack: true,
                width: true,
                createdAt: true,
                updatedAt: true,
                productCd: true,
                productDetailCd: true,

                // orderDetails: true,
                // changeOrderDetails: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    // Validate user
    if (
      (currentUser.roleDiv === USER_ROLE.PC &&
        order.companyCd !== currentUser.companyCd) ||
      (currentUser.roleDiv === USER_ROLE.SUPPLIER &&
        order.supplier.parentSupplierCd !== currentUser.supplierCd)
    ) {
      throw new ForbiddenException();
    }

    if (currentUser.roleDiv !== USER_ROLE.PC && order.temporaryFlag) {
      throw new BadRequestException(`Temporary flag not valid`);
    }

    if (
      currentUser.roleDiv === USER_ROLE.SUPPLIER &&
      +order.statusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM
    ) {
      throw new BadRequestException(
        `Supplier can't get order status ${ORDER_STATUS_DIV.ORDER_NOT_CONFIRM}`,
      );
    }

    let base: Base;

    if (order.destinationId) {
      base = await this.companiedService.findBaseById(order.destinationId);
      if (!base) {
        throw new BadRequestException(`Not found destination info`);
      }
    }

    await this.updateActionsConfirmedFlag(order.orderActions, currentUser);

    return {
      ...this.formattedOrder(order, currentUser),
      baseId: base?.id || null,
      baseName: base?.baseName || null,
      baseTelNumber: base?.telNumber || null,
      baseAddress1: base?.address1 || null,
    };
  }

  updateActionsConfirmedFlag(actions: OrderAction[], user: UserJwt) {
    let updatingActions: OrderAction[] = [];
    switch (user.roleDiv) {
      case USER_ROLE.ADMIN:
      case USER_ROLE.FW:
        updatingActions = actions.filter(
          (action) =>
            [
              ORDER_ACTION_DIV.ORDER_CONFIRMATION,
              ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE,
              ORDER_ACTION_DIV.CANCELLATION,
              ORDER_ACTION_DIV.ORDER_CHANGE,
            ].includes(+action.actionDiv) && !action.confirmedFlag,
        );
        break;
      case USER_ROLE.PC:
        updatingActions = actions.filter(
          (action) =>
            [
              ORDER_ACTION_DIV.REJECTION,
              ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE,
              ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_APPROVAL,
              ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_SUPPLIER,
              ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_FW,
              ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_SUPPLIER,
              ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_SUPPLIER,
              ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_FW,
              ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_SUPPLIER,
            ].includes(+action.actionDiv) && !action.confirmedFlag,
        );
        break;
      case USER_ROLE.SUPPLIER:
        updatingActions = actions.filter(
          (action) =>
            [
              ORDER_ACTION_DIV.APPROVAL,
              ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_REJECTION,
              ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW,
              ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW,
            ].includes(+action.actionDiv) && !action.confirmedFlag,
        );
        break;
    }
    if (!updatingActions.length) {
      return;
    }
    return this.prismaService.orderAction.updateMany({
      where: {
        id: {
          in: updatingActions.map((action) => action.id),
        },
      },
      data: {
        confirmedFlag: true,
      },
    });
  }

  formattedOrder(
    order: OrderHeader & {
      changeOrderHeaders: (ChangeOrderHeader & {
        changeOrderDetails: {
          productDetail: ProductDetail;
          quantity: ChangeOrderDetail['quantity'];
        }[];
      })[];
      supplier: Supplier;
      orderActions: OrderAction[];
      orderDetails: {
        productDetail: ProductDetail;
        quantity: OrderDetail['quantity'];
      }[];
      item: Item;
    },
    currentUser: UserJwt,
  ) {
    const orderInfo = {
      orderQuantity: order.orderQuantity,
      destinationId: order.destinationId,
      replyDeadline: order.replyDeadline,
      tradingCompany: order.tradingCompany,
      requestedDeadline: order.requestedDeadline,
      mixedLoadingFlag: order.mixedLoadingFlag,
      vehicleClassDiv: order.vehicleClassDiv,
      staffId: order.staffId,
      supplierCd: order.supplierCd,
    };
    let productDetails = order.orderDetails.map(
      ({ productDetail, quantity }) => {
        const gradeStrength = (productDetail as any).product.gradeStrength;
        const productName = (productDetail as any).product.productName;
        const itemVolume = calculateItemVolume(
          productDetail.width,
          productDetail.thickness,
          +productDetail.length,
          productDetail.quantityPerPack,
          10,
        );
        return omit(
          {
            ...productDetail,
            gradeStrength,
            desireQuantity: quantity,
            productName,
            itemVolume,
          },
          'product',
        );
      },
    );
    if (
      ([
        ORDER_STATUS_DIV.CHANGE_REQUEST,
        ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED,
      ].includes(+order.statusDiv) &&
        currentUser.roleDiv !== USER_ROLE.SUPPLIER) ||
      (+order.statusDiv === ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED &&
        currentUser.roleDiv === USER_ROLE.SUPPLIER)
    ) {
      const newestChangeOrderHeader = order.changeOrderHeaders[0];
      Object.keys(orderInfo).forEach((key) => {
        orderInfo[key] = get(newestChangeOrderHeader, key) ?? orderInfo[key];
      });
      productDetails = newestChangeOrderHeader?.changeOrderDetails?.length
        ? newestChangeOrderHeader?.changeOrderDetails?.map(
            ({ productDetail, quantity }) => {
              const gradeStrength = (productDetail as any).product
                .gradeStrength;
              const productName = (productDetail as any).product.productName;
              const itemVolume = calculateItemVolume(
                productDetail.width,
                productDetail.thickness,
                +productDetail.length,
                productDetail.quantityPerPack,
                10,
              );

              return omit(
                {
                  ...productDetail,
                  gradeStrength,
                  desireQuantity: quantity,
                  productName,
                  itemVolume,
                },
                'product',
              );
            },
          )
        : productDetails;
    }

    const newestOrderActions = order.orderActions[0];

    const commercialFlowId = makeCommercialFlowId(
      order.item.itemCd,
      order.supplier.supplierCd,
      order.companyCd,
    );

    return {
      ...pick(order, ['id', 'createdAt', 'updatedAt', 'temporaryFlag', 'memo']),
      statusDiv: +order.statusDiv,
      ...orderInfo,
      actions: order.orderActions.map((action) =>
        this.formatOrderAction(action),
      ),
      productDetails,
      companyName: (order as any).company.companyName,
      supplierName: order.supplier.supplierName,
      itemDisplayDiv: order.item.displayDiv,
      itemName: order.item.itemName,
      itemCd: order.item.itemCd,
      replyDeadline:
        +order.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST &&
        currentUser.roleDiv !== USER_ROLE.PC
          ? newestOrderActions.changeDeadline
          : orderInfo.replyDeadline,
      commercialFlowId,
    };
  }

  formatOrderAction(action: OrderAction) {
    return {
      id: Number(action.id),
      actionDiv: +action.actionDiv,
      ...pick(action, ['companyName', 'userName', 'memo', 'createdAt']),
    };
  }

  async bulkUpdateReplyDeadline(
    body: BatchUpdateReplyDeadlineDto,
    currentUser: UserJwt,
  ) {
    const orders = await this.prismaService.orderHeader.findMany({
      where: {
        id: {
          in: body.orderIds,
        },
        supplier: {
          parentSupplierCd: currentUser.supplierCd,
        },
      },
    });
    const forbiddenOrderIds = body.orderIds.filter(
      (id) => !orders.find((order) => order.id === id),
    );
    if (forbiddenOrderIds.length) {
      throw new ForbiddenException(
        `The current user does not have permission to edit orders: ${forbiddenOrderIds.join(
          ',',
        )}`,
      );
    }
    const invalidOrderIds = orders
      .filter(
        (order) =>
          +order.statusDiv !== ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED,
      )
      .map((order) => order.id);
    if (invalidOrderIds.length) {
      throw new BadRequestException(
        `List order have status invalid: ${invalidOrderIds.join(',')}`,
      );
    }

    const supplier = await this.suppliersService.findBySupplierId(
      currentUser.supplierCd,
    );
    await this.prismaService.$transaction(async (trx) => {
      const statusDiv = ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED.toString();
      await Promise.all(
        orders.map(async (order) => {
          const creatingOrderAction = this.getDefaultOrderAction(
            order.id,
            body.memo,
            supplier.supplierName,
          );
          await this.updateOrderHeaderById(
            order.id,
            { statusDiv, replyDeadline: new Date(order.requestedDeadline) },
            currentUser,
            trx,
          );
          await this.createOrderAction(
            {
              ...creatingOrderAction,
              closeFlag: true,
              statusDiv,
              actionDiv: ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE.toString(),
            },
            currentUser,
            trx,
          );
          await this.closeActionsOfRequestUpdate(
            ORDER_VALIDATION_REQUEST.CONFIRM_CREATE_ORDER,
            ORDER_ACTION_CONFIRMATION.ACCEPT,
            order.id,
            currentUser,
            trx,
          );
        }),
      );
    });
    return makeResponse(HttpStatus.OK);
  }
}
