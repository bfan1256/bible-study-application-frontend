import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    Angulartics2Module
  ]
})
export class SharedImportsModule { }