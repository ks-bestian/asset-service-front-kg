<script setup>
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const languageTy = ref(['한국어', '우즈벡어', '러시아어'])
const bookmarkList = ref([])
const open = ref([])

const fnAddBookmark = () => {
    const id = String(Date.now() + Math.random())
    bookmarkList.value.push({
        id: id,
        bookmarkTm: '00:00:00',
    })

    open.value.push(id)
}

const fnDelBookmark = (id) => {
    bookmarkList.value = bookmarkList.value.filter(item => item.id != id)
}

onMounted(() => {
})
</script>

<template>

    <div class="board_info">
        <div class="right mt_3">
            <i class="pi pi-bookmark-fill text_xl p_1">북마크</i>
            <Button icon="pi pi-plus" severity="secondary" variant="outlined" style="border-radius: 0%;"
                @click="fnAddBookmark"></Button>
        </div>
    </div>

    <div style="max-height: 15vh; overflow-y: auto;">
        <Accordion :value="open">
            <AccordionPanel v-for="item in bookmarkList" :key="item.id" :value="item.id">
                <AccordionHeader>
                    <div style="display: flex; align-items: center;" class="text_bold text_xl p_1">
                        <div style="display: flex; align-items: center;">
                            <Button icon="pi pi-times" severity="secondary" rounded variant="outlined" class="mr_3"
                                @click="fnDelBookmark(item.id)"></Button>
                            <DatePicker v-model="item.bookmarkTm" showIcon fluid iconDisplay="input" timeOnly showSeconds @click.stop>
                                <template #inputicon="slotProps">
                                    <i class="pi pi-clock" @click="slotProps.clickCallback"></i>
                                </template>
                            </DatePicker>
                        </div>
                    </div>
                </AccordionHeader>

                <AccordionContent>
                    <template v-for="(item, i) in languageTy" :key="i">
                        <InputText id="on_label" class="form_control mt_1" :placeholder="item" />
                    </template>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

    </div>
</template>



<style scoped>
.form_control {
    width: 100%;
}

:deep(.p-card-title) {
    display: flex;
    align-items: center;
}


:deep(.p-datepicker-fluid .p-datepicker-input) {
    width: 110px;
    font-size: 1.5rem;
    color: #0094D3;
}
</style>