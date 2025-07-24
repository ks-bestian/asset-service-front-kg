<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const billId = ref();
const stepId = ref();


const fnProcTest = () => {

    const formData = new FormData();
    formData.append("billId", billId.value);
    formData.append("stepId", stepId.value);


    axios.post('/testprocess/exe', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {

        console.log(response);

    }).catch(error => {
        console.log(error);
    });


};

const fnProcTestAuto = () => {

const formData = new FormData();
formData.append("billId", billId.value);
formData.append("stepId", stepId.value);


axios.post('/testprocess/autoexe', formData, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {

    console.log(response);

}).catch(error => {
    console.log(error);
});


};

</script>


<template>

<br>


<table width="700px">
<tr>
    <td width="100px">{{ t('10653') }}</td>
    <td width="300px">
        <input type="text" name="billId" v-model="billId" width="300">
        <input type="text" name="stepId" v-model="stepId" width="100">
    </td>
    <td><input type="button" value="send" @click="fnProcTest"></td>
</tr>
<tr>
    <td width="100px">{{ t('10653') }}</td>
    <td width="300px">
        <input type="text" name="billId" v-model="billId" width="300">
        <input type="text" name="stepId" v-model="stepId" width="100">
    </td>
    <td><input type="button" value="sendauto" @click="fnProcTestAuto"></td>
</tr>
</table>

</template>

