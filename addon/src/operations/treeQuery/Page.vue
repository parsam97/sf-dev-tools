<template>
  <div>
    <h1>Tree-Query</h1>
    <p>Welcome to the Tree-Query operation.</p>
  </div>
  <div>
    <p>First, define the sObjects for querying</p>
    <div class="control-section">
      <div class="col-lg-12 querybuilder-control">
        <ejs-querybuilder
          width="70%"
          :dataSource="qb_objectDataSource"
          :ruleChange="onRuleChange"
          ref="queryBuilderRef"
        ></ejs-querybuilder>
      </div>
    </div>
    <div>
      <ejs-grid
        ref="gridRef"
        :dataSource="qb_gridDataSource"
        :created="onGridCreated"
      ></ejs-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Common imports
  import { ref, onMounted } from 'vue'
  import { rest } from '@src/sfConn.js'

  // My styles
  import '@styles/base.css';
  import '@styles/initTheme.js';

  // Syncfusion
  import { DataManager, Query } from '@syncfusion/ej2-data';
  import { isNullOrUndefined } from '@syncfusion/ej2-base';
  import {
    QueryBuilderComponent as EjsQuerybuilder,
    ColumnDirective as EColumn,
    ColumnsDirective as EColumns
  } from "@syncfusion/ej2-vue-querybuilder";
  import {
    GridComponent as EjsGrid
  } from '@syncfusion/ej2-vue-grids'
  import { registerLicense } from '@syncfusion/ej2-base'
  registerLicense(import.meta.env.VITE_EJ2_LICENSE_KEY)
  
  const qb_objectDataSource = ref([]);
  const qb_gridDataSource = ref([]);
  const queryBuilderRef = ref(null);
  const gridRef = ref(null);

  onMounted(async () => {
    const queryResult = await rest('/services/data/v60.0/sobjects');
    qb_objectDataSource.value = queryResult.sobjects.map(obj => {
      const flatObj = {};
      for (let [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === 'object') { continue; } 
        else if (value == null) { value = 'null' }

        flatObj[key] = value;
      }
      return flatObj;
    });
    onRuleChange({ rule: queryBuilderRef.value?.ej2Instances?.rule || {} });
  });

  function onGridCreated() {
    if (!queryBuilderRef.value?.ej2Instances) {
      console.warn('QueryBuilder ref is not ready yet.');
      return;
    }
    const validRules = queryBuilderRef.value.ej2Instances.getValidRules(
      queryBuilderRef.value.ej2Instances.rule
    );
    onRuleChange({ rule: validRules });
  }

  function onRuleChange(args) {
    if (!qb_objectDataSource.value.length) {
      console.warn('Data not loaded yet, skipping rule change.');
      return;
    }
    
    const columnsToSelect = Object.keys(qb_objectDataSource.value[0] || {});
    const predicate = queryBuilderRef.value.ej2Instances.getPredicate(args.rule);
    let query = new Query().select(columnsToSelect);

    if (!isNullOrUndefined(predicate)) {
      query = query.where(predicate);
    }

    new DataManager(qb_objectDataSource.value)
      .executeQuery(query)
      .then((e) => {
        qb_gridDataSource.value = [];
        qb_gridDataSource.value = e.result;
        gridRef.value.ej2Instances.refresh();
        console.log('Set to', e.result);
        
      });
  }
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
@import "@syncfusion/ej2-navigations/styles/material.css";
@import "@syncfusion/ej2-vue-grids/styles/material.css";
</style>