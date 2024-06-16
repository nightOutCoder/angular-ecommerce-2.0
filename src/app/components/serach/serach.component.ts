import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-serach',
  templateUrl: './serach.component.html',
  styleUrl: './serach.component.css'
})
export class SerachComponent implements OnInit {
 
  constructor(private router: Router){
  }

  ngOnInit() {
  }

  doSearch(inpuSerachData: string){
    console.log(`Input search data is ${inpuSerachData}`);
    this.router.navigateByUrl(`/search/${inpuSerachData}`);
  }
  
}
