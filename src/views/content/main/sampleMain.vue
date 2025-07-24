<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

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
import { useI18n } from 'vue-i18n'

const billCnt_ST001 = ref(0); //Signature

const billCnt_ST010 = ref(0); //Billing

const billCnt_ST020 = ref(0); //Withdrawal

const billCnt_ST110 = ref(0); //Committee

const billCnt_ST120 = ref(0); //Plenary

const billCnt_ST410 = ref(0); //Government transfer

const billCnt_ST510 = ref(0); //Presidential rejection

const billCnt_ST520 = ref(0); //horror


const notices = ref([]); // Notice list

const { t } = useI18n()

// const mtngListOfDay = computed(() => {
//     return mtngList.value.filter(mtng => {
//         return mtng.dueDtm && dayjs(mtng.dueDtm).isSame(selectedDay.value, 'day');
//     });
// });


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

// const fnToday = () => {
//     currentMonth.value = today;
//     selectedDay.value = today;
// }


const fnGetMtngList = (fromDay, toDay) => {

    // const startOfMonth = currentMonth.value.startOf('month');
    // const endOfMonth = currentMonth.value.endOf('month');
    // const searchFromDate = startOfMonth.subtract(7, 'day').format('YYYYMMDD');
    // const searchToDate = endOfMonth.add(7, 'day').format('YYYYMMDD');


    const searchFromDate = fromDay.format('YYYYMMDD');
    const searchToDate = toDay.format('YYYYMMDD');

    let params = {};
    params.searchAgeCd = searchAgeCd.value;
    params.searchFromDate = searchFromDate;
    params.searchToDate = searchToDate;
    params.mtngTypeCd = mtngTypeCd.value;
    // if (mtngtypecd.value == '1') {//Committee meeting
    //     params.deptcd = Userinfo.deptcd;
    // }


    const apiUrl = `/bill/mtng/from`;
    store.API_LIST(apiUrl, params).then((data) => {
        mtngList.value = data.data.data;

        for (var i = 0; i < daysInMonth.value.length; ++i) {
            const day = daysInMonth.value[i];
            day.mtngList = mtngList.value.filter(mtng => mtng.dueDtm && dayjs(mtng.dueDtm).isSame(day, 'day'));
        }

    }).catch(({ message }) => {
        console.log("message : ", message);
    });
}

const fnGoMtngDetail= (mtng)=>{
    router.push({name: 'mtng.allMtng.detail', query : {  mtngId: mtng.mtngId }});
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

    fnGetMtngList(days[0], days[days.length - 1]);
}

// Number of cases by stages of bills

const fnSearchBillCnt = () => {
    let params = {};
    // params.statCd = statCd.value;
    // params.sclDscRcpNmb = sclDscRcpNmb.value;
    // params.billName = billName.value;
    // params.toDate = isEmpty(toDate.value) ? '' : replace(toDate.value, /-/g, '');
    // params.fromDate = isEmpty(fromDate.value) ? '' : replace(fromDate.value, /-/g, '');
    // params.lang = lang;

    params.naTermCd = ageObj.value.naTermCd;

    const apiUrl = '/bill/apply';
    store.API_LIST(apiUrl, params).then((data) => {
        const billList = data.data.data;
        billCnt_ST001.value = billList.filter(bill => bill.statCd == 'ST001').length;
        billCnt_ST010.value = billList.filter(bill => bill.statCd == 'ST010').length;
        billCnt_ST020.value = billList.filter(bill => bill.statCd == 'ST020').length;
        billCnt_ST110.value = billList.filter(bill => bill.statCd == 'ST110').length;
        billCnt_ST120.value = billList.filter(bill => bill.statCd == 'ST120').length;
        billCnt_ST410.value = billList.filter(bill => bill.statCd == 'ST410').length;
        billCnt_ST510.value = billList.filter(bill => bill.statCd == 'ST510').length;
        billCnt_ST520.value = billList.filter(bill => bill.statCd == 'ST520').length;

    }).catch(({ message }) => {
        console.log("message : ", message);
    });

}

const fnGoBillApply = (statCd) => {
    router.push({ name: 'bill.apply', query : { statCd } });
}

const fnGetNotices = () => {
    const apiUrl = '/admin/board_main';
    store.API_LIST(apiUrl).then((data) => {
        notices.value = data.data.data;
        console.log("notices.value : ", notices.value);
        var swiper = new Swiper('.news_slider', {
            modules: [Navigation],
            slidesPerView: 5,
            spaceBetween: 20,
            navigation: {
                prevEl: '.btn_slider_prev',
                nextEl: '.btn_slider_next',
            },
        });
    }).catch(({ message }) => {
        console.log("message : ", message);
    });
}

const fnGoNotice = (brdId) => {
    router.push({name: 'notice.board.detail', query : {  key: 'NOTI', id: brdId }});
}

onMounted(() => {
    setDayByMonth();
    fnSearchBillCnt();
    fnGetNotices();
});

</script>

<template>
    <div class="content_inner">
        <div class="process_section">
            <ol class="process_list">
                <li @dblclick="fnGoBillApply('ST001')">
                    <strong class="process_tit">{{ t('10044') }}</strong>
                    <span class="process_num">{{ billCnt_ST001 }}</span>
                </li>
                <li @dblclick="fnGoBillApply('ST010')">
                    <strong class="process_tit">{{ t('10114') }}</strong>
                    <span class="process_num">{{ billCnt_ST010 }}</span>
                </li>
                <li @dblclick="fnGoBillApply('ST110')">
                    <strong class="process_tit">{{ t('10045') }}</strong>
                    <span class="process_num">{{ billCnt_ST110 }}</span>
                </li>
                <li @dblclick="fnGoBillApply('ST120')">
                    <strong class="process_tit">{{ t('10046') }}</strong>
                    <span class="process_num">{{ billCnt_ST120 }}</span>
                </li>
                <li @dblclick="fnGoBillApply('ST410')">
                    <strong class="process_tit">{{ t('10063') }}</strong>
                    <span class="process_num">{{ billCnt_ST410 }}</span>
                </li>
                <li @dblclick="fnGoBillApply('ST520')">
                    <strong class="process_tit">{{ t('10048') }}</strong>
                    <span class="process_num">{{ billCnt_ST520 }}</span>
                </li>
            </ol>
        </div>
        <div class="schedule_section">
            <div class="left">
                <div class="calendar_wrap type2">
                    <div class="calendar_head">
                        <button type="button" class="v_btn" @click="prevMonth"><i class="v_ico ico_chevron_left_lg"></i></button>
                        <span class="calendar_tit">{{ currentMonth.format('MMMM, YYYY') }}</span>
                        <button type="button" class="v_btn" @click="nextMonth"><i class="v_ico ico_chevron_right_lg"></i></button>
                    </div>
                    <div class="calendar_body">
                        <div class="calendar_week">
                            <div>SUN</div>
                            <div>MON</div>
                            <div>TUE</div>
                            <div>WED</div>
                            <div>WED</div>
                            <div>FRI</div>
                            <div>SAT</div>
                        </div>
                        <div class="calendar_days">
                            <div
                                v-for="(day, index) in daysInMonth"
                                :key="index"
                                :class="{ past: !day.isSame(currentMonth, 'month') }"
                            >
                                <button type="button" class="day">{{ day.date() }}</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_circle" :class="{type1: mtng.mtngTypeCd == '1', type2: mtng.mtngTypeCd == '2'}" v-for="mtng in day.mtngList" :key="mtng.mtngId"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="calendar_info">
                        <div class="info_item">
                            <span class="v_badge badge_circle type1"></span>
                            <span>{{ t('10045') }}</span>
                        </div>
                        <div class="info_item">
                            <span class="v_badge badge_circle type2"></span>
                            <span>{{ t('10046') }}</span>
                        </div>
                        <!-- <div class="info_item">
                            <span class="v_badge badge_circle type3"></span>
                            <span>{{ t('10446') }}</span>
                        </div> -->
                    </div>
                </div>

            </div>
            <div class="right">
                <nav class="tab_menu mb_2">
                    <ul class="tab_list">
                        <li class="on"><a href="javascript:void(0)" @click="fnTab('1')">{{ t('10045') }}</a></li>
                        <li><a href="javascript:void(0)" @click="fnTab('2')">{{ t('10046') }}</a></li>
                        <!-- <li><a href="javascript:void(0)" @click="fnTab('3')">{{ t('10446') }}</a></li> -->
                    </ul>
                </nav>
                <div class="v_table table_list fixed_header no_clickable" v-if="mtngList?.length">
                    <table>
                        <colgroup>
                            <col span="2" style="width: 40.5%;">
                            <col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">{{ t('10132') }}</th>
                                <th scope="col">{{ t('10187') }}</th>
                                <th scope="col">{{ t('10050') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="mtng in mtngList" :key="mtng.mtngId" @dblclick="fnGoMtngDetail(mtng)">
                                <td class="text_left">{{ mtng.mtngTypeCd == '1' ? `${mtng.deptNm}` : t('10046') }}</td>
                                <td class="text_left">{{ mtng.mtngPlc }}</td>
                                <td>{{ dayjs(mtng.dueDtm).format('DD/MM/YYYY HH:mm') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="" v-else>
                    {{ t('10445') }}
                </div>
            </div>
        </div>
        <div class="news_section">
            <div class="news_head">
                <div class="left">
                    <span class="v_tit">{{ t('10028') }}</span>
                </div>
                <div class="right">
                    <div class="news_ctrl">
                        <!-- <div class="btn_wrap">
                            <a href="javascript:void(0)" class="v_btn on">Жаңылыктар</a>
                            <a href="javascript:void(0)" class="v_btn">Новости мероприятия</a>
                        </div> -->
                        <div class="slider_nav">
                            <button type="button" class="v_btn btn_slider_prev"><i class="v_ico ico_arr_left"></i></button>
                            <button type="button" class="v_btn btn_slider_next"><i class="v_ico ico_arr_right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="news_cont">
                <div class="swiper news_slider">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="notice in notices">
                            <a href="javascript:void(0)" class="news_item" @click="fnGoNotice(notice.brdId)">
                                <span class="news_badge" style="text-overflow: hidden;"><span>{{ notice.brdSj }}</span></span>
                                <strong class="news_tit">{{ notice.brdCn }}</strong>
                                <span class="news_date">{{ dayjs(notice.regDt).format('DD/MM/YYYY HH:mm') }}</span>
                            </a>
                        </div>



                        <!-- <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Жогорку Кеңештин Төрагасы Нурланбек Шакиев кыргызстандыктарды 2025-Жаңы жыл майрамы менен куттуктады</strong>
                                <span class="news_date">31-12-2024 16:00</span>
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Тармактык комитет “CASA-1000” долбооруна байланышкан маселени карады</strong>
                                <span class="news_date">31-12-2024 12:12</span>
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Депутаттар Шарапаткан Мажитова жана Винера Раимбачаева Бишкектеги «Үмүт үйү» социалдык мекемесинен кабар алышты</strong>
                                <span class="news_date">30-12-2024 14:41</span>
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Төрага Нурланбек Шакиев Корея Республикасынын Улуттук Ассамблеясынын Төрагасы У Вон Шикке көңүл айтты</strong>
                                <span class="news_date">29-12-2024 18:13</span>
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Төраганын орун басары Джамиля Исаева ар кыл тармактын алдыңкыларына Жогорку Кеңештин сыйлыктарын тапшырды</strong>
                                <span class="news_date">27-12-2024 13:31</span>
                            </a>
                        </div>
                        <div class="swiper-slide">
                            <a href="javascript:void(0)" class="news_item">
                                <span class="news_badge"><span>Жаңылыктар</span></span>
                                <strong class="news_tit">Депутат Гүлшаркан Култаеванын демилгеси менен залкар комузчу Ныязаалы Борош уулунун өмүрү жана чыгармачылыгына арналган эки китептин расмий ачылышы болуп өттү</strong>
                                <span class="news_date">26-12-2024 17:48</span>
                            </a>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.process_section .process_list > li {
    max-height: 12rem;
    height: 12rem;
}  
/*
.process_section .process_list > li {
    background: 
    linear-gradient(to bottom, #0C208D 50%, #fff 50%);
}    
*/
.process_section .process_list > li {
    background: 
    linear-gradient(to bottom, #0094D3 50%, #fff 50%);
}    
.process_section .process_list > li .process_tit {
    color: #fff;
}
.process_section .process_list > li .process_num:before {
    background-color: #fff;
}

.news_badge {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.news_slider .news_item {
  height: 13.2rem;
}
.news_slider .news_item .news_tit {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 4rem;
}
.news_section {
  background-color: #66707a;
}

.schedule_section {
  margin-top: 2rem;
}
.news_section {
  margin-top: 2rem;
}

.main_wrapper #v_content {
  padding: 2rem 2rem 0;
}
.process_section .process_list > li .process_tit {
  max-height: 6rem;
  height: 6rem;
  line-height: 2rem;
}
.process_section .process_list > li .process_num {
  font-size: 3rem;
  height: 6rem;
  
}
.process_section .process_list > li .process_num:before {
  width: 0rem;
  margin-top: -0.5rem;
}

</style>
