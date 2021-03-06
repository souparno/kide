import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Terminal } from 'xterm';

import { XtermService } from '../services/xterm/xterm.service';
import { ViewService } from '../services/view/view.service';

declare var $:any;

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.less']
})
export class TerminalComponent implements OnInit {

  @ViewChild('terminal') terminal: ElementRef;
  term: Terminal;
  termRowHeight;
  termColWidth;
	
  constructor(private xterm: XtermService, private view: ViewService) { }

  setDimentions(h, w): void {
    $("#terminal").css("height", h);
    $("#terminal").css("width", w);
  }

  ngOnInit() {
    let self = this; 
    this.setDimentions(window.innerHeight/3, window.innerWidth - 300);
    $(window).on('resize', function(){
      self.setDimentions(window.innerHeight/3, window.innerWidth - 300);
      let size = self.calculateSize();
      if(self.term) self.term.resize(size.cols, size.rows);
      self.xterm.resize(size);
    });
    this.view.treeVisibilityListener().subscribe((status: boolean) => {
      let val = (status)?300:50;
      this.setDimentions(window.innerHeight/3, window.innerWidth - val);
      let size = this.calculateSize(val);
      if(this.term) this.term.resize(size.cols, size.rows);
      this.xterm.resize(size);
    });
  }

  ngAfterViewInit() {
    let size = this.calculateSize();
    this.xterm.init(size).then(()=>{
      this.term = new Terminal({
        cols: size.cols,
        rows: size.rows,
        theme: {
          background: '#1e1e1e'
        }
      });
      this.term.open(this.terminal.nativeElement);
      this.term.on('key', (key, evt) => {
        this.xterm.write(key);
      });
      this.xterm.on().subscribe(data => {
        this.term.write(data);
      });
    }).catch(err => {
      console.error(err);
    });
  }

  calculateSize(val?: number): any {
    let rows = Math.floor((window.innerHeight/3)/17.21);
    let cols = Math.floor((window.innerWidth - (val || 300))/9.25);
    return {rows, cols};
  }
}
