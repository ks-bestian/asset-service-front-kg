<template>
    <div class="confirm_layer">
        <Toast/>
        <ConfirmDialog/>
    </div>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

const confirm = useConfirm();
const toast = useToast();

const showConfirmDialog = ({ message, header, icon, acceptMessage, rejectMessage, onAccept, onReject }) => {
    // confirm.require({
    //     message,
    //     header,
    //     icon,
    //     accept: () => {
    //         onAccept && onAccept();
    //         toast.add({ severity: 'info', summary: 'Confirmed', detail: acceptMessage || 'You have accepted', life: 3000 });
    //     },
    //     reject: () => {
    //         onReject && onReject();
    //         toast.add({ severity: 'error', summary: 'Rejected', detail: rejectMessage || 'You have rejected', life: 3000 });
    //     }
    // });


    return new Promise((resolve) => {
        confirm.require({
            message,
            header,
            icon,
            accept: () => {
                toast.add({ severity: 'info', summary: 'Confirmed', detail: acceptMessage || 'You have accepted', life: 3000 });
                resolve(true);
            },
            reject: () => {
                toast.add({ severity: 'error', summary: 'Rejected', detail: rejectMessage || 'You have rejected', life: 3000 });
                resolve(false);
            },
        });
    });
};

defineExpose({ showConfirmDialog });
</script>
<style>

.p-toast-message{
    z-index: 90000 !important; /* PRIMEVUE Modal Default Z-Index (1000) value */
}
.p-toast{
    z-index: 90000 !important;
}
.p-dialog-mask{
    z-index: 90000 !important; /* PRIMEVUE Modal Default Z-Index (1000) value */
}
</style>
