<template>
  <div id="headerContainer">
    <div id="header">
      <h1>Tree-Query</h1>
      <p>Welcome to the Tree-Query operation. This operation lets you define rules, from which it generates valid SOQL queries.</p>
    </div>
  </div>

  <div id="contentContainer">
    <div id="sObjectSelection">
      <div class="control-section">
        <div class="col-lg-12 querybuilder-control">
          <ejs-querybuilder
            width="70%"
            :dataSource="qb_sObjDataSource"
            :ruleChange="onSobjRuleChange"
            ref="sObjQueryBuilderRef"
          ></ejs-querybuilder>
        </div>
      </div>
      <ejs-grid
        ref="sObjGridRef"
        height=300 
        :enableInfiniteScrolling='true'
        :pageSettings='sObjGridOptions'
        :dataSource="qb_sObjGridDataSource"
        :created="onSobjGridCreated"
      >
        <e-columns>
          <e-column
            v-for="column in qb_sObjGridColumns"
            :key="column.name"
            :field='column.name'
            :headerText='column.label'
            textAlign='Left'></e-column>
        </e-columns>
      </ejs-grid>
    </div>
  
    <div id="fieldSelection">
      <div class="control-section">
        <div class="col-lg-12 querybuilder-control">
          <ejs-querybuilder
            width="70%"
            :dataSource="qb_fieldDataSource"
            :ruleChange="onFieldRuleChange"
            ref="fieldQueryBuilderRef"
          ></ejs-querybuilder>
        </div>
      </div>
      <div>
        <ejs-grid
          ref="fieldGridRef"
          :dataSource="qb_fieldGridDataSource"
          :created="onFieldGridCreated"
        ></ejs-grid>
      </div>
    </div>
  
    <ejs-accordion expandMode="Single">
      <e-accordionitems>
        <e-accordionitem expanded="true" header="Step 1. Build rules to define the sObjects of your resulting queries"
          content="#sObjectSelection"></e-accordionitem>
        <e-accordionitem header="Step 2. Find fields for sObjects"
          content="#fieldSelection"></e-accordionitem>
        <e-accordionitem header="Result"
          content="JavaScript (JS) is an interpreted computer programming language.It was originally implemented as part of web browsers so that client-side scripts could interact with the user, control the browser, communicate asynchronously, and alter the document content that was displayed."></e-accordionitem>
      </e-accordionitems>
    </ejs-accordion>
  </div>

  <div id="footerContainer">
    id box
  </div>

</template>

<script setup lang="ts">
  // Common imports
  import { ref, onMounted, provide, nextTick } from 'vue'
  import { rest } from '@src/sfConn.js'

  // My styles
  import '@styles/base.css';
  import '@styles/initTheme.js';

  // Syncfusion
  import { DataManager, Query } from '@syncfusion/ej2-data';
  import { isNullOrUndefined } from '@syncfusion/ej2-base';
  import {
    QueryBuilderComponent as EjsQuerybuilder
  } from "@syncfusion/ej2-vue-querybuilder";
  import {
    GridComponent as EjsGrid,
    ColumnsDirective as EColumns,
    ColumnDirective as EColumn,
    InfiniteScroll,
    Page
  } from '@syncfusion/ej2-vue-grids'
  import {
    AccordionComponent as EjsAccordion, AccordionItemsDirective as EAccordionitems, AccordionItemDirective as EAccordionitem
  } from "@syncfusion/ej2-vue-navigations";
  import { registerLicense } from '@syncfusion/ej2-base'
  registerLicense(import.meta.env.VITE_EJ2_LICENSE_KEY)
  
  // sObject Grid
  const qb_sObjDataSource = ref([]);
  const qb_sObjGridDataSource = ref([]);
  const qb_sObjGridColumns = ref([]);
  const sObjQueryBuilderRef = ref(null);
  const sObjGridRef = ref(null);
  const sObjGridOptions = { pageSize: 5 };
  provide('grid', [Page, InfiniteScroll]);

  // field Grid
  const qb_fieldDataSource = ref([]);
  const qb_fieldGridDataSource = ref([]);
  const fieldQueryBuilderRef = ref(null);
  const fieldGridRef = ref(null);

  onMounted(async () => {
    const queryResult = await rest('/services/data/v60.0/sobjects');
    qb_sObjDataSource.value = queryResult.sobjects.map(obj => {
      const flatObj = {};
      for (let [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === 'object') { continue; } 
        else if (value == null) { value = 'null' }

        flatObj[key] = value;
      }
      return flatObj;
    });
    onSobjRuleChange({ rule: sObjQueryBuilderRef.value?.ej2Instances?.rule || {} });
  });

  function onSobjGridCreated() {
    if (!sObjQueryBuilderRef.value?.ej2Instances) {
      console.warn('sObject QueryBuilder ref is not ready yet.');
      return;
    }
    const validRules = sObjQueryBuilderRef.value.ej2Instances.getValidRules(
      sObjQueryBuilderRef.value.ej2Instances.rule
    );
    onSobjRuleChange({ rule: validRules });
  }

  function onFieldGridCreated() {
    if (!fieldQueryBuilderRef.value?.ej2Instances) {
      console.warn('Field QueryBuilder ref is not ready yet.');
      return;
    }
    const validRules = fieldQueryBuilderRef.value.ej2Instances.getValidRules(
      fieldQueryBuilderRef.value.ej2Instances.rule
    );
    onSobjRuleChange({ rule: validRules });
  }
  
  function onSobjRuleChange(args) {
    const inst = sObjQueryBuilderRef.value.ej2Instances;
    const predicate = inst.getPredicate(args.rule);

    // 1) Extract every field used in the predicate
    const active = new Set<string>();
    if (predicate) {
      if (predicate.predicates) {
        predicate.predicates.forEach(p => active.add(p.field));
      } else {
        active.add(predicate.field);
      }
    }

    // 2) Rebuild the columns list: always Label + each active field
    qb_sObjGridColumns.value = [
      { name: 'label', label: 'Label' },
      ...Array.from(active).map(f => ({
        name: f,
        label: f
      }))
    ];

    // 3) Refresh the grid columns so Syncfusion picks them up
    nextTick(() => {
      sObjGridRef.value.ej2Instances.refreshColumns();
    });

    // 4) Finally, apply the actual filter to your data
    updateGrid(qb_sObjDataSource, predicate, sObjGridRef);
  }

  function ensureColumn(columnsRef, columnToAdd) {
    console.log('ensuring', columnToAdd.name, columnToAdd.temp);
    
    if (!columnsRef.value.some(c => c.name === columnToAdd.name)) {
      columnsRef.value.push(columnToAdd);
    }
  }

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  
  function updateGrid(dataSourceRef, predicate, gridRef) {
    if (!dataSourceRef.value.length) {
      console.warn('Data not loaded yet, skipping rule change.');
      return;
    }
    
    const columnsToSelect = Object.keys(dataSourceRef.value[0] || {});
    let query = new Query().select(columnsToSelect);
  
    if (!isNullOrUndefined(predicate)) {
      query = query.where(predicate);
    }
  
    new DataManager(dataSourceRef.value)
      .executeQuery(query)
      .then((e) => {
        qb_sObjGridDataSource.value = [];
        qb_sObjGridDataSource.value = e.result;
        if (e.result.length == 0) {
          gridRef.value.ej2Instances.dataSource = [];
        }
        gridRef.value.setProperties({ dataSource:  gridRef.value.ej2Instances.dataSource});
        gridRef.value.ej2Instances.refresh();
      });
  }

  function onFieldRuleChange(args) {
    updateGrid(
      qb_fieldDataSource,
      fieldQueryBuilderRef.value.ej2Instances.getPredicate(args.rule),
      fieldGridRef
    )
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
@import "@syncfusion/ej2-vue-navigations/styles/material.css";
</style>