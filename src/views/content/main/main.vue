<script setup>
import { ref, onMounted } from "vue";
import Swiper from 'swiper';

onMounted(() => {
    var swiper = new Swiper('.news_slider', {
        slidesPerView: 5,
        spaceBetween: 20,
        navigation: {
            prevEl: '.btn_slider_prev',
            nextEl: '.btn_slider_next',
        },
    });
});

</script>

<template>
    <div class="content_inner">
        <div class="process_section">
            <ol class="process_list">
                <li>
                    <strong class="process_tit">мыйзам долбоор каттоо</strong>
                    <span class="process_num">3</span>
                </li>
                <li>
                    <strong class="process_tit">кароого жөнөтүү</strong>
                    <span class="process_num">7</span>
                </li>
                <li>
                    <strong class="process_tit">комитетте кароо</strong>
                    <span class="process_num">8</span>
                </li>
                <li>
                    <strong class="process_tit">ЖКтин жыйынында кароо</strong>
                    <span class="process_num">9</span>
                </li>
                <li>
                    <strong class="process_tit">өкмөткө жөнөтүү</strong>
                    <span class="process_num">8</span>
                </li>
                <li>
                    <strong class="process_tit">кабыл алуу</strong>
                    <span class="process_num">7</span>
                </li>
            </ol>
        </div>
        <div class="schedule_section">
            <div class="left">
                <div class="calendar_wrap type2">
                    <div class="calendar_head">
                        <button type="button" class="v_btn"><i class="v_ico ico_chevron_left_lg"></i></button>
                        <span class="calendar_tit">October, 2024</span>
                        <button type="button" class="v_btn"><i class="v_ico ico_chevron_right_lg"></i></button>
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
                            <div>
                                <button type="button" class="day">1</button>
                            </div>
                            <div>
                                <button type="button" class="day">2</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                    <span class="v_badge badge_square type2">к</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">3</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type4">с</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">4</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">5</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                    <span class="v_badge badge_square type2">к</span>
                                    <span class="v_badge badge_square type4">с</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">6</button>
                            </div>
                            <div>
                                <button type="button" class="day">7</button>
                            </div>
                            <div>
                                <button type="button" class="day">8</button>
                            </div>
                            <div>
                                <button type="button" class="day">9</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type4">с</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">10</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">11</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type4">с</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">12</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type2">к</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">13</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">14</button>
                            </div>
                            <div>
                                <button type="button" class="day">15</button>
                            </div>
                            <div>
                                <button type="button" class="day">16</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type2">к</span>
                                    <span class="v_badge badge_square type4">с</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">17</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">18</button>
                            </div>
                            <div>
                                <button type="button" class="day">19</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">20</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type3">т</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">21</button>
                            </div>
                            <div>
                                <button type="button" class="day">22</button>
                            </div>
                            <div>
                                <button type="button" class="day">23</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type3">т</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">24</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type4">с</span>
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">25</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                    <span class="v_badge badge_square type3">т</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">26</button>
                            </div>
                            <div>
                                <button type="button" class="day">27</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type5">и</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">28</button>
                            </div>
                            <div>
                                <button type="button" class="day">29</button>
                            </div>
                            <div>
                                <button type="button" class="day">30</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type1">п</span>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="day">31</button>
                                <div class="badge_wrap">
                                    <span class="v_badge badge_square type2">к</span>
                                    <span class="v_badge badge_square type3">т</span>
                                </div>
                            </div>
                            <div class="past">
                                <span class="day">1</span>
                            </div>
                            <div class="past">
                                <span class="day">2</span>
                            </div>
                            <div class="past">
                                <span class="day">3</span>
                            </div>
                            <div class="past">
                                <span class="day">4</span>
                            </div>
                        </div>
                    </div>
                    <div class="calendar_info">
                        <div class="info_item">
                            <span class="v_badge badge_square type1">п</span>
                            <span>парламент</span>
                        </div>
                        <div class="info_item">
                            <span class="v_badge badge_square type2">к</span>
                            <span>комитет</span>
                        </div>
                        <div class="info_item">
                            <span class="v_badge badge_square type3">т</span>
                            <span>төрага</span>
                        </div>
                        <div class="info_item">
                            <span class="v_badge badge_square type4">с</span>
                            <span>семинар</span>
                        </div>
                        <div class="info_item">
                            <span class="v_badge badge_square type5">и</span>
                            <span>иш-чаралар</span>
                        </div>
                    </div>
                </div>

            </div>
            <div class="right">
                <nav class="tab_menu mb_2">
                    <ul class="tab_list">
                        <li class="on"><a href="javascript:void(0)">баары</a></li>
                        <li><a href="javascript:void(0)">комитет</a></li>
                        <li><a href="javascript:void(0)">жалпы жыйын</a></li>
                        
                    </ul>
                </nav>
                <div class="v_table table_list fixed_header no_clickable">
                    <table>
                        <colgroup>
                            <col span="2" style="width: 40.5%;">
                            <col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">комитет</th>
                                <th scope="col">аталыш</th>
                                <th scope="col">дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text_left">социалдык саясат боюнча комитет</td>
                                <td class="text_left">409-ЖК жыйындын отуруму</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                            <tr>
                                <td class="text_left">улуттук коргоо комитет</td>
                                <td class="text_left">409-ЖК айыл чарба иштери боюнча мыйзам карап чыгуу</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                            <tr>
                                <td class="text_left">айыл чарба боюнча маалымат коммите</td>
                                <td class="text_left">409-ЖК жыйындын отуруму</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                            <tr>
                                <td class="text_left">айыл чарба боюнча маалымат коммите</td>
                                <td class="text_left">409-ЖК жыйындын отуруму</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                            <tr>
                                <td class="text_left">маалымат боюнча комитет</td>
                                <td class="text_left">409-ЖК пленардык жыйыны</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                            <tr>
                                <td class="text_left">маалымат боюнча комитет</td>
                                <td class="text_left">409-ЖК жыйындын отуруму 409-ЖК пленардык жыйыны</td>
                                <td>2023-10-18 10:00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="news_section">
            <div class="news_head">
                <div class="left">
                    <span class="v_tit">Жарыя</span>
                </div>
                <div class="right">
                    <div class="news_ctrl">
                        <div class="btn_wrap">
                            <a href="javascript:void(0)" class="v_btn on">Жаңылыктар</a>
                            <a href="javascript:void(0)" class="v_btn">Новости мероприятия</a>
                        </div>
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
                        <div class="swiper-slide">
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
                        </div>
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
.process_section .process_list > li {
    background: 
    linear-gradient(to bottom, #0C208D 50%, #fff 50%);
}    
.process_section .process_list > li .process_tit {
    color: #fff;
}
.process_section .process_list > li .process_num:before {
    background-color: #fff;
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
