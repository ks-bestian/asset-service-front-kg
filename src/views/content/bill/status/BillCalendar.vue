<script setup>
import { ref, computed, onMounted, watch } from "vue";
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { DatePicker } from "primevue";
import { useStore } from "@/store";
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";

const { t } = useI18n()
const store = useStore();
const router = useRouter();
const userInfo = store.loginInfo;
const today = dayjs();
const currentMonth = ref(dayjs());
const daysInMonth = ref([]);
const mtngTypeCd = ref('1');
const ageObj = computed(() => store.getAgeObj);
const searchAgeCd = ref(ageObj.value.naTermCd);
const mtngList = ref([]);
const selectedDay = ref(today);
const mtngListOfDay = computed(() => {
    return mtngList.value.filter(mtng => {
        return mtng.dueDtm && dayjs(mtng.dueDtm).isSame(selectedDay.value, 'day');
    });
});

watch([() => mtngTypeCd.value, () => currentMonth.value], () => {
    setDayByMonth();
})

const fnTab = (val) => {
    mtngTypeCd.value = val;
};

const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, "month");
};

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, "month");
};

const fnToday = () => {
    currentMonth.value = today;
    selectedDay.value = today;
}

const fnGetMtngList = () => {

    const startOfMonth = currentMonth.value.startOf('month');
    const endOfMonth = currentMonth.value.endOf('month');
    const searchFromDate = startOfMonth.subtract(7, 'day').format('YYYYMMDD');
    const searchToDate = endOfMonth.add(7, 'day').format('YYYYMMDD');

    let params = {};
    params.searchAgeCd = searchAgeCd.value;
    params.searchFromDate = searchFromDate;
    params.searchToDate = searchToDate;
    params.mtngTypeCd = mtngTypeCd.value;
    // if(mtngTypeCd.value == '1') { //Committee meeting
    //     params.deptCd = userInfo.deptCd;
    // }

    
    const apiUrl = `/bill/mtng/from`;
    store.API_LIST(apiUrl, params).then((data) => {
        mtngList.value = data.data.data;

        for(var i = 0; i < daysInMonth.value.length; ++i) {
            const day = daysInMonth.value[i];
            day.mtngList = mtngList.value.filter(mtng => mtng.dueDtm && dayjs(mtng.dueDtm).isSame(day, 'day'));
        }

    }).catch(({ message }) => {
        console.log("message : ", message);
    });
}

const setDayByMonth = () => {

    const startOfMonth = currentMonth.value.startOf('month');
    const endOfMonth = currentMonth.value.endOf('month');

    const days = [];

    // Fill the date of the previous month

    for (let i = 0; i < startOfMonth.day(); i++) {
        days.unshift(startOfMonth.subtract(i + 1, 'day'));
    }

    // Filling the current monthly date

    for (let i = 0; i < endOfMonth.date(); i++) {
        days.push(startOfMonth.add(i, 'day'));
    }

    // Fill the next month's date

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
            days.push(endOfMonth.add(i, 'day'));
        }
    }

    daysInMonth.value = days;

    fnGetMtngList();
}

const onclickDay = (day) => {
    selectedDay.value = day;
}

const fnGoMtngDetail= (mtng)=>{
    router.push({name: 'mtng.allMtng.detail', query : {  mtngId: mtng.mtngId }});
}

onMounted(() => {
    setDayByMonth();
})

</script>

<template>
    <div class="content_inner">
        <!-- <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">Күн тартиби</h2>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10016') }}</li>
                    <li>{{ t('10017') }}</li>
                </ul>
            </nav>
        </div> -->
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="content_row schedule_wrap">
                <div class="col_6">
                    <nav class="tab_menu type2 mb_6">
                        <ul class="tab_list">
                            <li class="on"><a href="javascript:void(0)" @click="fnTab('1')">{{ t('10523') }}</a></li>
                            <li><a href="javascript:void(0)" @click="fnTab('2')">{{ t('10046') }}</a></li><!--Plenary-->
                            <!-- <li><a href="javascript:void(0)" @click="fnTab('3')">{{ t('10446') }}</a></li>-->
                        </ul>
                    </nav>
                    <div class="calendar_wrap">
                        <button type="button" class="v_btn btn_outline_primary btn_md todayBtn" @click="fnToday">TODAY</button>
                        <div class="calendar_head">
                            <button type="button" class="v_btn" @click="prevMonth"><i class="v_ico ico_chevron_left_lg"></i></button>
                            <span class="calendar_tit">{{ currentMonth.format('YYYY.MM') }}</span>
                            <button type="button" class="v_btn" @click="nextMonth"><i class="v_ico ico_chevron_right_lg"></i></button>
                        </div>
                        <div class="calendar_body">
                            <div class="calendar_week">
                                <div>SUN</div>
                                <div>MON</div>
                                <div>TUE</div>
                                <div>WED</div>
                                <div>THU</div>
                                <div>FRI</div>
                                <div>SAT</div>
                            </div>
                            <div class="calendar_days">
                                <div
                                    v-for="(day, index) in daysInMonth"
                                    :key="index"
                                    :class="{ past: !day.isSame(currentMonth, 'month'), today: day.isSame(selectedDay, 'day') }"
                                >
                                    <button type="button" class="day" @click="onclickDay(day)">{{ day.date() }}</button>
                                    <div class="badge_wrap">
                                        <span class="v_badge badge_circle" :class="{type1: mtng.mtngTypeCd == '1', type2: mtng.mtngTypeCd == '2'}" v-for="mtng in day.mtngList" :key="mtng.mtngId"></span>
                                    </div>
                                    <!-- <div class="badge_wrap">
                                        <span class="v_badge badge_square type1">Ж</span>
                                        <span class="v_badge badge_square type2">К</span>
                                    </div> -->
                                </div>
                            </div>
                            <!-- <div class="calendar_info">
                                <div class="info_item">
                                    <span class="v_badge badge_square badgeInfo type1"></span>
                                    <span>{{ t('10046') }}</span>
                                </div>
                                <div class="info_item">
                                    <span class="v_badge badge_square badgeInfo type2"></span>
                                    <span>{{ t('10045') }}</span>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>

                <div class="col_6">
                    <div class="event_wrap">
                        <div class="event_date">
                            <strong>{{ selectedDay.format('YYYY-MM-DD') }}</strong>({{ selectedDay.format('ddd').toUpperCase() }})
                        </div>
                        <div class="event_list">
                            <div class="event_item" v-for="mtng in mtngListOfDay" :key="mtng.mtngId" @dblclick="fnGoMtngDetail(mtng)">
                                <span class="v_badge badge_circle " :class="{type1: mtng.mtngTypeCd == '1', type2: mtng.mtngTypeCd == '2'}"></span>
                                <strong class="event_tit">{{ mtng.mtngTypeCd == '1' ? `${mtng.deptNm}` + t('10523') : t('10524') }}</strong><!--Committee /National Assembly plenary session-->
                                <span class="event_cont">{{ dayjs(mtng.dueDtm).format('HH:mm') }} {{ mtng.mtngPlc }}</span>
                            </div>
                            <div class="event_item" v-if="!mtngListOfDay?.length">
                                <span class="event_cont">{{ t('10445') }}</span><!--There is no meeting schedule.-->
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style>
.todayBtn {
  margin-left: auto !important;
}

.calendar_info{
    display: flex;
}

.info_item:not(:first-child) {
    margin-left: 1.5rem;
}

.badgeInfo{
    margin-right: 1rem;
}

.saturday {
  color: blue;
}

.sunday {
  color: red;
}
</style>