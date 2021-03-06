import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ProductService } from 'src/app/product.service';
import { Product } from 'src/app/models/product';
import { DataTableResource } from 'angular7-data-table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  subscription: Subscription;
  tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number;

  constructor(private productService: ProductService) { 
    this.subscription = this.productService.getAll().subscribe(products => { 
      this.products = products;
      console.log('PRODUCT: ', products);
      this.initializeTable(products);
    });
  }

  reloadItems(params) {
    if(!this.tableResource){
      return;
    }
    this.tableResource.query(params).then(items => this.items =items);
  }

  private initializeTable(products: Product[]) {
    this.tableResource = new DataTableResource(products);
    this.tableResource.query({ offset: 0 }).then(items => this.items =items);
    this.tableResource.count().then(count => this.itemCount = count);
  }

  filter(query: string) {
    console.log(query);
    let filteredProducts = (query) ?
       this.products.filter(p => p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : this.products;
    
    this.initializeTable(filteredProducts);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
  }

}
