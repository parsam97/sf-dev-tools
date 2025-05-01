<template>
  <div>
    <h1>Tree-Query</h1>
    <p>Welcome to the Tree-Query operation.</p>
  </div>
  <div class="control-section">
    <div class="col-lg-12 querybuilder-control">
      <ejs-querybuilder width="70%" :dataSource="dataSource">
        <e-columns>
          <e-column field='EmployeeID' label='Employee ID' type='number' />
          <e-column field='FirstName' label='First Name' type='string' />
          <e-column field='TitleOfCourtesy' label='Title Of Courtesy' type='boolean' :values="values" />
          <e-column field='Title' label='Title' type='string' />
          <e-column field='HireDate' label='Hire Date' type='date' format='dd/MM/yyyy' />
          <e-column field='Country' label='Country' type='string' />
          <e-column field='City' label='City' type='string' />
        </e-columns>
      </ejs-querybuilder>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { rest } from '@src/sfConn.js'
  import { QueryBuilderComponent as EjsQuerybuilder, ColumnDirective as EColumn, ColumnsDirective as EColumns } from "@syncfusion/ej2-vue-querybuilder";
  import { registerLicense } from '@syncfusion/ej2-base'
  registerLicense(import.meta.env.VITE_EJ2_LICENSE_KEY)
  import '@styles/base.css';
  import '@styles/initTheme.js';

  const dataSource = [{
    'EmployeeID': 1,
    'FirstName': 'Nancy',
    'Title': 'Sales Representative',
    'TitleOfCourtesy': 'Ms.',
    'HireDate': '22/07/2001',
    'City': 'Seattle',
    'Country': 'USA'
  },
  {
    'EmployeeID': 2,
    'FirstName': 'Andrew',
    'Title': 'Vice President',
    'TitleOfCourtesy': 'Dr.',
    'HireDate': '21/04/2003',
    'City': 'Tacoma',
    'Country': 'USA'
  },
  {
    'EmployeeID': 3,
    'FirstName': 'Janet',
    'Title': 'Sales Representative',
    'TitleOfCourtesy': 'Ms.',
    'HireDate': '22/07/2001',
    'City': 'Kirkland',
    'Country': 'USA'
  }];

  onMounted(async () => {
    try {
      const queryResult = await rest('/services/data/v60.0/sobjects');
      console.log('Query result:', queryResult);
    } catch (error) {
      console.error('REST API call failed:', error);
    }
  });
</script>

<style>
@import "@syncfusion/ej2-base/styles/material.css";
@import "@syncfusion/ej2-buttons/styles/material.css";
@import "@syncfusion/ej2-splitbuttons/styles/material.css";
@import "@syncfusion/ej2-dropdowns/styles/material.css";
@import "@syncfusion/ej2-inputs/styles/material.css";
@import "@syncfusion/ej2-lists/styles/material.css";
@import "@syncfusion/ej2-popups/styles/material.css";
@import "@syncfusion/ej2-calendars/styles/material.css";
@import "@syncfusion/ej2-vue-querybuilder/styles/material.css";
</style>