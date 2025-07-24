import {defineStore} from "pinia";
import axios from "@/axios/index.js";

export const useOrgStore = defineStore('organization',{
    state: ()=>({
        organizations: [{
            orgNameKy: String,
            orgNameRu: String,
            orgInn : String,
            created: String,
            enabled: Boolean
        }],
    }),
    getters: {
        getOrganization: state => state.organizations,
        getOrganizationByAble: state => state.organizations.filter(org => org.enabled === 'true'),
    },
    actions: {
        setOrganization() {
            axios.get("/organization/other-list")
                .then(response => {
                    console.log(response.data.data);
                    this.organizations = response.data.data;
                })
        }
    },
    persist: {
        storage: sessionStorage,
        pick : ['organizations']
    },

    })