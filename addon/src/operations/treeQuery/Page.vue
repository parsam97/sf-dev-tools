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
        :dataSource="qb_sObjGridDataSource"
        :created="onSobjGridCreated"
      ></ejs-grid>
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
        <e-accordionitem expanded="true" header="Step 1. Rules to define sObjects"
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
  import {
    AccordionComponent as EjsAccordion, AccordionItemsDirective as EAccordionitems, AccordionItemDirective as EAccordionitem
  } from "@syncfusion/ej2-vue-navigations";
  import { registerLicense } from '@syncfusion/ej2-base'
  registerLicense(import.meta.env.VITE_EJ2_LICENSE_KEY)
  
  const qb_sObjDataSource = ref([]);
  const qb_sObjGridDataSource = ref([]);
  const sObjQueryBuilderRef = ref(null);
  const sObjGridRef = ref(null);

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
    if (!qb_sObjDataSource.value.length) {
      console.warn('Data not loaded yet, skipping rule change.');
      return;
    }
    
    const columnsToSelect = Object.keys(qb_sObjDataSource.value[0] || {});
    const predicate = sObjQueryBuilderRef.value.ej2Instances.getPredicate(args.rule);
    let query = new Query().select(columnsToSelect);

    if (!isNullOrUndefined(predicate)) {
      query = query.where(predicate);
    }

    new DataManager(qb_sObjDataSource.value)
      .executeQuery(query)
      .then((e) => {
        qb_sObjGridDataSource.value = [];
        qb_sObjGridDataSource.value = e.result;
        sObjGridRef.value.ej2Instances.refresh();
      });
  }

  function onFieldRuleChange(args) {
    if (!qb_fieldDataSource.value.length) {
      console.warn('Data not loaded yet, skipping rule change.');
      return;
    }
    
    const columnsToSelect = Object.keys(qb_fieldDataSource.value[0] || {});
    const predicate = fieldQueryBuilderRef.value.ej2Instances.getPredicate(args.rule);
    let query = new Query().select(columnsToSelect);

    if (!isNullOrUndefined(predicate)) {
      query = query.where(predicate);
    }

    new DataManager(qb_fieldDataSource.value)
      .executeQuery(query)
      .then((e) => {
        qb_sObjGridDataSource.value = [];
        qb_sObjGridDataSource.value = e.result;
        sObjGridRef.value.ej2Instances.refresh();
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
@import "@syncfusion/ej2-vue-navigations/styles/material.css";
</style>