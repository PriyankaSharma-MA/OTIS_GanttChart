import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ViewEncapsulation } from '@angular/core';

import { MasterService } from '../app/_services/masterdata.service'
import { ProgramList, RegionList, ResourceList, RoadMapData, excelRoadMapdata } from '../app/_models/masterdata.model'
import { MatOption } from '@angular/material';

declare function getAllRoadMapData(params: RoadMapData[], boolean): any;
declare function createGanttChart(params: excelRoadMapdata[], boolean): any;
// import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MasterService],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit {
  searchGanttChart: FormGroup;

  @ViewChild('allProgramSelected') private allProgramSelected: MatOption;
  @ViewChild('allregionSelected') private allregionSelected: MatOption;
  @ViewChild('allresourceSelected') private allresourceSelected: MatOption;

  title = 'ganttchart';
  response: string;
 

  selectedProgram: string[];
  listProgram: ProgramList[];
  finallistProgram: ProgramList[];



  selectedRegion: string[];
  listRegion: RegionList[];
  finallistRegion: RegionList[];



  selectedResource:string[];
  listResource: ResourceList[];
  finallistResource: ResourceList[];


  searchexcelRoadMapdata: excelRoadMapdata[];
  listRoadMapData: RoadMapData[];

 
  excelColordata: string[]
  excelRoadMapdata: excelRoadMapdata[]

  public programFilterCtrl: FormControl = new FormControl();
  public regionFilterCtrl: FormControl = new FormControl();
  public resourceFilterCtrl: FormControl = new FormControl();
  constructor(
    private fb: FormBuilder, private masterService: MasterService) { }


  ngOnInit() {
    this.searchGanttChart = this.fb.group({
  
      program: new FormControl(''),
      region: new FormControl(''),
      resource: new FormControl('')
    });

    this.programFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterProgram();
      });
    this.regionFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterRegion();
      });
    this.resourceFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterResource();
      });
    this.getRoadMapData();
 
  }
  togglePerOne( key) {

    if (key == 'region') {
      if (this.allregionSelected.selected) {
        this.allregionSelected.deselect();
        this.selectedRegion=this.searchGanttChart.controls.region.value;
        this.filterRoadmapData();
        return false;
      }
      if (this.searchGanttChart.controls.region.value.length == this.listRegion.length)
      {
        this.allregionSelected.select();
     
      }
      this.selectedRegion=this.searchGanttChart.controls.region.value;
    }

    else if (key == 'program') {
      if (this.allProgramSelected.selected) {
        this.allProgramSelected.deselect();
        this.selectedProgram=this.searchGanttChart.controls.program.value;
        this.filterRoadmapData();
        return false;
      }
      if (this.searchGanttChart.controls.program.value.length == this.listProgram.length)
      {
        this.allProgramSelected.select();
      
      }
      this.selectedProgram=this.searchGanttChart.controls.program.value;
    } 
    
    else if (key == 'resource') {
      if (this.allresourceSelected.selected) {
        this.allresourceSelected.deselect();
        this.selectedResource=this.searchGanttChart.controls.resource.value;
        this.filterRoadmapData();
        return false;
      }
      if (this.searchGanttChart.controls.resource.value.length == this.listResource.length)
      {
        this.allresourceSelected.select();
      
      }
      this.selectedResource=this.searchGanttChart.controls.resource.value;
    }
    this.filterRoadmapData();

  }
  toggleAllSelection(key) {

    if (key == 'region') {
      if (this.allregionSelected.selected) {
        this.searchGanttChart.controls.region
          .patchValue([...this.listRegion.map(item => item.value), 0]);
      } else {
        this.searchGanttChart.controls.region.patchValue([]);
      }
      this.selectedRegion=this.searchGanttChart.controls.region.value;
    } else  if (key == 'program') {
      if (this.allProgramSelected.selected) {
        this.searchGanttChart.controls.program
          .patchValue([...this.listProgram.map(item => item.value), 0]);
      } else {
        this.searchGanttChart.controls.program.patchValue([]);
      }
      this.selectedProgram=this.searchGanttChart.controls.program.value;
    }else  if (key == 'resource') {
      if (this.allresourceSelected.selected) {
        this.searchGanttChart.controls.resource
          .patchValue([...this.listResource.map(item => item.value), 0]);
      } else {
        this.searchGanttChart.controls.resource.patchValue([]);
      }
      this.selectedResource=this.searchGanttChart.controls.resource.value;
    }
    this.filterRoadmapData();
    console.log (this.selectedProgram)
  }

  private filterProgram() {
    var newlist;
    if (!this.listProgram) {
      return;
    }
    // get the search keyword
    let search = this.programFilterCtrl.value;
    if (!search) {

      this.listProgram = this.finallistProgram
      return;
    } else {
      search = search.toLowerCase();
    }
    newlist =
      this.listProgram = this.finallistProgram.filter(item => item.label.toLowerCase().indexOf(search) > -1)

  }

  private filterRegion() {
    var newlist;
    if (!this.listRegion) {
      return;
    }
    // get the search keyword
    let search = this.regionFilterCtrl.value;
    if (!search) {

      this.listRegion = this.finallistRegion
      return;
    } else {
      search = search.toLowerCase();
    }
    newlist =
      this.listRegion = this.finallistRegion.filter(item => item.label.toLowerCase().indexOf(search) > -1)

  }
  private filterResource() {
    var newlist;
    if (!this.listResource) {
      return;
    }
    // get the search keyword
    let search = this.resourceFilterCtrl.value;
    if (!search) {

      this.listResource = this.finallistResource
      return;
    } else {
      search = search.toLowerCase();
    }
    newlist =
      this.listResource = this.finallistResource.filter(item => item.label.toLowerCase().indexOf(search) > -1)

  }


  getRoadMapData() {
    this.masterService.getRoadMapData('Global_IT_Roadmap.xlsx').subscribe(
      data => {
        this.listRoadMapData = data
        getAllRoadMapData(this.listRoadMapData, false)
        this.excelColordata = this.listRoadMapData[0].excelColordata
        this.excelRoadMapdata = this.listRoadMapData[0].excelRoadMapdata
        this.bindDropDown();
      }
    )
  }

  filterRoadmapData() {
//console.log(this.selectedProgram)
//console.log(this.selectedRegion)
//console.log(this.selectedResource)
    this.searchexcelRoadMapdata = this.excelRoadMapdata.filter(
      o1 => this.selectedProgram.some(o2 => o2 == o1.program_name) &&

        this.selectedRegion.some(o3 => o3 == o1.region_name) &&
        this.selectedResource.some(o4 => o4 == o1.resource_name)
    );
    createGanttChart(this.searchexcelRoadMapdata, false)
  }
  bindDropDown() {
    this.listProgram = [];
    this.listRegion = [];
    this.listResource = [];

    var dupesprogram = [];
    var dupesregion = [];
    var dupesresource = [];

    var filteredList = this.excelRoadMapdata
    for (let i = 0; i < filteredList.length; i++) {
      let rowData = filteredList[i];
      if (!dupesprogram[rowData.program_name]) {
        dupesprogram[rowData.program_name] = true;
        this.listProgram.push({
          value: rowData.program_name,
          label: rowData.program_name
        });

      }
      if (!dupesregion[rowData.region_name]) {
        dupesregion[rowData.region_name] = true;
        this.listRegion.push({
          value: rowData.region_name,
          label: rowData.region_name
        });

      }
      if (!dupesresource[rowData.resource_name]) {
        dupesresource[rowData.resource_name] = true;
        this.listResource.push({
          value: rowData.resource_name,
          label: rowData.resource_name
        });

      }
    }


    this.finallistProgram = this.listProgram;
    this.finallistRegion = this.listRegion;
    this.finallistResource = this.listResource;
    this.searchGanttChart.controls.program
    .patchValue([...this.listProgram.map(item => item.value), 0]);
    this.searchGanttChart.controls.region
    .patchValue([...this.listRegion.map(item => item.value), 0]);
    this.searchGanttChart.controls.resource
    .patchValue([...this.listResource.map(item => item.value), 0]);
   
    this.selectedProgram=[];
    this.selectedRegion=[]
    this.selectedResource=[]
    this.listProgram.forEach(item=>(this.selectedProgram.push(item.value)))
    this.listRegion.forEach(item=>(this.selectedRegion.push(item.value)))
    this.listResource.forEach(item=>(this.selectedResource.push(item.value)))
  }

}

