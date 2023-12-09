import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Product } from 'src/app/models/new-product';
import { ProductsService } from 'src/app/services/products.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  host:{class:'flex-grow-1'}
})
export class ProductsListComponent implements OnInit {
  
  displayedColumns: string[] = ['check', 'id', 'name', 'brand', 'cost', 'stock','createdAt', 'category','edit'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  
  waiting:Boolean=true
  
  products!:Array<Product>


  constructor( private _products:ProductsService,
    public dialog:MatDialog){}
  
  ngOnInit(): void {
    this._products.getAll().subscribe(
      res=>{ 
        this.waiting=false
        this.products=res.sort((a:any, b:any) => a.id - b.id)
      // TABLA DE MATERIAL
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
    
    },err=>{console.error(err)}
    )
  }


  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  check(element:any, event: MatCheckboxChange) {
      
    if (event.checked) {
      element.selected = true
    } else {
      element.selected = false
      // const index = this.selectedProducts.indexOf(element, 0);
      // if (index > -1)
      //   this.selectedProducts.splice(index, 1);
      // if (this.selectedProducts.length == 0)
      //    this.isCheck();
    }    
  }

  exists(product: Product) {
    const exists = this.products.find(prod => prod == product)
    return exists?.selected
  };

  isCheck(): boolean {
    const selected = this.products.filter(prod => prod.selected == true)
    if (selected.length == 0 || selected.length != this.products.length) {
      return false;
    }
    return true;
  }

  isAnySelected(){
    const selected = this.products.filter(prod => prod.selected == true)
    
    if (selected.length >= 0) {
      return true;
    }
    
    return false;
  }

  checkAll(event:any) {
    if (event.checked) {
     this.products.forEach(prod => prod.selected = true)
    } else {
      this.products.forEach(prod => prod.selected = false)
    }
}

checkOne(product:Product){
  product.selected=true;  
}

deleteProduct(id:number){
  this.openDialog('Delete Product', 'Are you sure you want to delete this product?', 'ok')
}

sendBulk(){
  const selected = this.products.filter(prod => prod.selected == true)
  selected.forEach(prod => { delete prod.selected})
  console.log(selected)
  //this._products.updateBulk(selected)
}

openDialog(title:string, message:string, button:string){

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{
        title: title,
        message:message,
        button: button
      }, 
      maxWidth: '450px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result) {}
    //reset
  });
}

}
