import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CompaniesService } from './companies/companies.service';
import { SuppliersService } from './suppliers/suppliers.service';
import { CommercialFlowsService } from './commercial-flows/commercial-flows.service';
import { ProductDetailService } from './product-details/product-details.service';
import { ProductService } from './products/products.service';
import { ProductPriceService } from './product-prices/product-prices.service';
import { ItemService } from './item/item.service';
import { DivValuesService } from './div-values/div-values.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private companiesService: CompaniesService,
    private suppliersService: SuppliersService,
    private commercialFlowsService: CommercialFlowsService,
    private productDetailService: ProductDetailService,
    private productsService: ProductService,
    private productPriceService: ProductPriceService,
    private itemService: ItemService,
    private divValuesService: DivValuesService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
  async onApplicationBootstrap(): Promise<any> {
    try {
      await this.divValuesService.initializeDivValueData()
      const dataOfCompanies =
        await this.companiesService.initializeCompaniesData();
      const dataOfSuppliers =
        await this.suppliersService.initializeSuppliersData();
      const dataOfItem = await this.itemService.initializeItemData();
      if (dataOfCompanies && dataOfSuppliers && dataOfItem) {
        await this.commercialFlowsService.initializeSuppliersData();
        const dataOfProducts = await this.productsService.initializeProductData();
        if (dataOfProducts) {
          await Promise.all([
            this.productDetailService.initializeProductDetailData(),
            this.productPriceService.initializeProductPricesData(),
          ]);
        }
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
}
