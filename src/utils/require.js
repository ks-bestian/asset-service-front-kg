import { useConfirm } from "primevue/useconfirm";
import msg from '@/utils/message'


export function useRequireConfirm() {
    const confirm = useConfirm();

    return function (target, onAccept, label, apiMethod) {
        console.log(target)
        console.log('target')
        let message = ''
        if(apiMethod === 'create') {
            message = msg.confirm.create(label)
            console.log(message)
        } else if(apiMethod === 'update') {
            message = msg.confirm.update(label)
        } else if(apiMethod === 'delete') {
            message = msg.confirm.delete(label)
        }
        confirm.require({
            rejectProps: {
                severity: 'secondary',
                outlined: true,
                size: 'large'
            },
            acceptProps: {
                size: 'large'
            },
            target: target,
            message: message,
            accept: onAccept
        })
    }

}

