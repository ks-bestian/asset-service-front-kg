<script setup>
import {ref, onMounted, watch, onBeforeMount} from "vue";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import {useStore, usePageStore, useAlarmStore} from "@/store";
import { useRoute, useRouter } from "vue-router";
// import as component
import Badge from 'primevue/badge';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const pageStore = usePageStore();
const store = useStore();
const alarmStore = useAlarmStore();
const router = useRouter();
const route = useRoute();
const menuList = ref([]);
const active = ref();

watch(() => active.value, () => {

})

watch(() => route.path, () => {
  setActiveMenu();
})

const setActiveMenu = () => {
  for (var i = 0; i < store.menuList?.length; ++i) {
    if (findMenu(store.menuList[i])) {
      active.value = store.menuList[i].key;
      break;
    }
  }
}

const findMenu = (node) => {
  if (node.menuPath && route.path.startsWith(node.menuPath)) {
    return true;
  }
  let ret = false;
  for (var i = 0; i < node.children?.length; ++i) {
    ret = ret || findMenu(node.children[i]);
  }
  return ret;
}

const tabVal = ref('MENU');
const fnTab = (val) => {
  if (val == 'MENU') {
    tabVal.value = 'MENU';
  } else {
    tabVal.value = 'MY';
  }
};

const open = ref(true);
const toggleSideBar = () => {
  open.value = !open.value;
}

const selectedSite = ref("");
const sites = ref([
  { name: 'kenesh', url: 'https://kenesh.kg/' },
]);
const fnGoSite = () => {
  if (selectedSite.value) {
    window.open(selectedSite.value, '_blank');
  }
}

const fnList = () => {
  let params = { lang: localStorage.getItem('languageType'), type: 'menu', menuList: 'sideBar' }
  store.API_LIST('/admin/deptmenu', params).then((data) => {
    menuList.value = data.data.data;
    store.menuList = menuList.value;
    setActiveMenu();

    menuList.value.forEach(item => {
      item.childLen = item.children && item.children.length > 0 ? 1 : 0;

      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          if (alarmStore.alarm[child.key] !== undefined && alarmStore.alarm[child.key] > 0) {
            child.alarmCnt = alarmStore.alarm[child.key];
            item.alarmCnt = 1;
          }else{
            child.alarmCnt = 0;
          }
        });
      }

    });

  }).catch(({ message }) => {
  
    console.log(message);
  })
}


const onClickMenuLevel1 = (menu) => {
  // if(active.value != null) {
  //   router.push(`${menu.menuPath || menu.children[0]?.menuPath}`);
  // }

  if (menu.menuPath) {
    router.push(`${menu.menuPath}`);
  }
  if (menu.key === 41) { // Document management

    open.value = false;
  }
}

const onClickMenuLevel2 = (submenu) => {
  pageStore.fnClearSession();
  if (submenu.menuPath) {
    router.push(`${submenu.menuPath}`)
  }
}

onBeforeMount(()=>{
  alarmStore.getAllCount()
})

onMounted(() => {
  fnList();

  //Select Menu Top Menu
  // $ ('. lnb_area .depth2 Li.on'). Closest ('Li.collapse'). AddClass ('on');
  // $ ('. lnb_area .depth2 li.on'). Closest ('Ul.depth2'). Show (); Vali

});
</script>



<template>
  <div id="v_sidebar" :class="{ open }">
    <div class="sidebar_inner">
      <nav class="tab_menu">
        <ul class="tab_list">
          <li :class="{ on: tabVal == 'MENU' }"><a href="javascript:void(0)" @click="fnTab('MENU')">Menu</a></li>
          <li :class="{ on: tabVal == 'MY' }">
          </li>
        </ul>
      </nav>
      <div class="sidebar_cont">
        <div class="lnb_area" v-show="tabVal == 'MENU'">

          <Accordion v-for="menu in menuList" v-model:value="active"
            :collapseIcon="menu.childLen > 0 ? 'pi pi-minus' : 'null'"
            :expandIcon="menu.childLen > 0 ? 'pi pi-plus' : 'null'">
            <AccordionPanel :key="menu.key" :value="menu.key">

              <AccordionHeader @click="onClickMenuLevel1(menu)">
                <span class="flex items-center gap-2 w-full">
                  <div style="position: relative; display: inline-block;">
                    <span class="font-bold whitespace-nowrap depth1"><a href="javascript:void(0)">{{ menu.label }}</a></span>

                    <Badge severity="danger" v-if="menu.alarmCnt > 0" style="position: absolute; top: -4px; right: -5px;" />
                  </div>
                </span>
              </AccordionHeader>

              <AccordionContent v-if="menu.children">
                <ul class="depth2">
                  <li v-for="submenu in menu.children" :key="submenu.key"
                    :class="{ on: $route.path.startsWith(`${submenu.menuPath}`) }"
                    style="display: flex; align-items: center;">
                    <a href="javascript:void(0)" @click="onClickMenuLevel2(submenu)">{{ submenu.label }}</a>
                    <span style="font-weight: 600; color: #0094D3; margin-left: 15px;">{{ alarmStore.alarm[submenu.key]  > 0 ? alarmStore.alarm[submenu.key]  : '' }}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>

        <div class="lnb_area" v-show="tabVal == 'MY'">
          <Accordion value="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            <AccordionPanel value="10">
              <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                  <span class="font-bold whitespace-nowrap depth1"><a href="javascript:void(0)">{{ t('10577') }}</a>
                  </span>
                </span>
              </AccordionHeader>
              <AccordionContent>
                <ul class="depth2">
                  <li><a href="javascript:void(0)" @click="$router.push('/main/bill/agree/dtl')">О проекте Закона «О
                      внесении изменений в некоторые законодательные акты Кыргызской Республики в сфере налогообложения
                      исоциального страхования»</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/main/bill/agree/dtl')"> О проекте Закона «О
                      внесении изменений в некоторые законодательные акты Кыргызской Республики в сфере налогообложения
                      исоциального страхования»</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/main/bill/agree/dtl')"> О проекте Закона «О
                      внесении изменений в некоторые законодательные акты Кыргызской Республики в сфере налогообложения
                      исоциального страхования»</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/main/bill/agree/dtl')"> О проекте Закона «О
                      внесении изменений в некоторые законодательные акты Кыргызской Республики в сфере налогообложения
                      исоциального страхования»</a></li>
                </ul>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="11">
              <AccordionHeader>
                <span class="flex items-center gap-2 w-full">
                  <span class="font-bold whitespace-nowrap depth1"><a href="javascript:void(0)">{{ t('10681') }}</a>
                  </span>
                </span>
              </AccordionHeader>
              <AccordionContent>
                <ul class="depth2">
                  <li><a href="javascript:void(0)" @click="$router.push('/myPage/msg/detail?key=rcv')">{{ t('10682') }}</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/myPage/msg/detail?key=rcv')">{{ t('10682') }}</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/myPage/msg/detail?key=rcv')">{{ t('10682') }}</a></li>
                  <li><a href="javascript:void(0)" @click="$router.push('/myPage/msg/detail?key=rcv')">{{ t('10682') }}</a></li>
                </ul>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
        <div class="input_item moveBox">
          <select class="form_control" v-model="selectedSite">
            <option value="">{{ t('10423') }}</option>
            <option v-for="site in sites" :key="site.url" :value="site.url">{{ site.name }}</option>
          </select>
          <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSite">GO</a>
        </div>

      </div>
    </div>
    <button type="button" class="btn_sidebar" @click="toggleSideBar()"><i class="v_ico ico_sidebar"></i></button>
  </div>
</template>

<style>
.moveBox {
  display: flex;
  margin-top: 3rem;
}

.moveBox .form_control {
  width: 80%;
  margin: 0 0.5rem;
}

.p-accordionpanel:not(.p-disabled).p-accordionpanel-active>.p-accordionheader {
  background-color: #0094D3 !important;
  color: white !important;
  text-shadow: 0 0 0.05rem #fff;
  padding: 17px;
}

.p-accordionheader {
  padding: 17px !important;
}
</style>
