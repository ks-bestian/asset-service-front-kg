import axios from "@/axios";
import { NodeService } from "@/NodeService";
import { useStore } from "@/store";

export const DocumentService = {

    getFoldersSearchAuthorized(folderList) {
        const map = new Map();
        const set = new Set();
        for(var i = 0; i < folderList.length; ++i) {
            const folder = folderList[i];
            map.set(folder.folderId, folder);
        }
        for(var i = 0; i < folderList.length; ++i) {
            let folder = folderList[i];
            if(folder.searchYn !== true) {
                continue;
            }
            while(folder) {
                if(set.has(folder)) {
                    break;
                }
                set.add(folder);
                folder = map.get(folder.upperFolderId);
            }
        }
        return [...set];
    },

    getDeptFolderTree() {

        const store = useStore();
        
        return store.API_LIST('/document/dept/folders/all')
            .then(res => {
                let folderList = res.data.data;
                // console.log('folderList', folderList);
                folderList = this.getFoldersSearchAuthorized(folderList);
                // console.log('folderList2', folderList);

                const folderTree = this.getFolderTree(folderList);
                return folderTree;
            })
    },

    getMyFolderTree() {

        const store = useStore();
        
        return store.API_LIST('/document/my/folders/all')
            .then(res => {
                const folderList = res.data.data;

                console.log('folderList', folderList);

                const folderTree = this.getFolderTree(folderList);
                return folderTree;
            })
    },

    getFolderTree(folderList) {
        const tree = [];
        const map = new Map();
        for(var i = 0; i < folderList.length; ++i) {
            var folder = folderList[i];
            map.set(folder.folderId, folder);
        }
        for(var i = 0; i < folderList.length; ++i) {
            var folder = folderList[i];

            folder.key = folder.folderId;
            folder.label = folder.folderNm;
            folder.icon = 'pi pi-fw pi-folder';

            if(folder.upperFolderId === -1) {
                tree.push(folder);
            }
            else {
                var upperFolder = map.get(folder.upperFolderId);
                if(upperFolder === undefined || upperFolder === null) {
                    continue;
                }
                if(upperFolder.children === undefined) {
                    upperFolder.children = [];
                }
                upperFolder.children.push(folder);
                folder.upperFolder = upperFolder;
            }
        }
        tree.sort(function(a, b) {
            return a.folderNm.localeCompare(b.folderNm);
        })
        for(var i = 0; i < tree.length; ++i) {
            this._sortChildren(tree[i]);
        }
        return tree;
    },

    _sortChildren(node) {
        if(node.children === undefined) {
            return;
        }
        node.children.sort(function(a, b) {
            return a.folderNm.localeCompare(b.folderNm);
        })
        for(var i = 0; i < node.children.length; ++i) {
            this._sortChildren(node.children[i]);
        }
    },

    getDeptFolders(upperFolderId, title, regNm) {

        const store = useStore();

        const params = {upperFolderId, title, regNm};
        return store.API_LIST('/document/dept/folders', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.folderId;
                })
                list.sort(function(a, b) {
                    return a.folderNm.localeCompare(b.folderNm);
                })
                return list;
            });
    },

    getDeptFiles(folderId, title, regNm) {
        const store = useStore();

        const params = {folderId, title, regNm};
        return store.API_LIST('/document/dept/files', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getDeptFoldersAndFiles(folderId, title, regNm) {
        const p1 = this.getDeptFolders(folderId, title, regNm);
        const p2 = this.getDeptFiles(folderId, title, regNm);
        return Promise.all([p1, p2]).then(([r1, r2]) => ([...r1, ...r2]));
    },

    getMyFolders(upperFolderId, title, regNm) {

        const store = useStore();

        const params = {upperFolderId, title, regNm};
        return store.API_LIST('/document/my/folders', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.folderId;
                })
                list.sort(function(a, b) {
                    return a.folderNm.localeCompare(b.folderNm);
                })
                return list;
            });
    },

    getMyFiles(folderId, title, regNm) {
        const store = useStore();

        const params = {folderId, title, regNm};
        return store.API_LIST('/document/my/files', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getMyFoldersAndFiles(folderId, title, regNm) {
        const p1 = this.getMyFolders(folderId, title, regNm);
        const p2 = this.getMyFiles(folderId, title, regNm);
        return Promise.all([p1, p2]).then(([r1, r2]) => ([...r1, ...r2]));
    },

    getDeleteFolders(title, regNm) {

        const store = useStore();

        const params = {title, regNm};
        return store.API_LIST('/document/trash/folders', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.folderId;
                })
                list.sort(function(a, b) {
                    return a.folderNm.localeCompare(b.folderNm);
                })
                return list;
            });
    },

    getDeleteFiles(title, regNm) {
        const store = useStore();

        const params = {title, regNm};
        return store.API_LIST('/document/trash/files', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getDeleteFoldersAndFiles(title, regNm) {
        const p1 = this.getDeleteFolders(title, regNm);
        const p2 = this.getDeleteFiles(title, regNm);
        return Promise.all([p1, p2]).then(([r1, r2]) => ([...r1, ...r2]));
    },

    newDeptFolder(upperFolderId, folderNm) {

        const store = useStore();

        const params = {upperFolderId, folderNm};
        return store.API_SAVE('document/dept/folders', params);
    },

    newMyFolder(upperFolderId, folderNm) {

        const store = useStore();

        const params = {upperFolderId, folderNm};
        return store.API_SAVE('document/my/folders', params);
    },

    _find(node, folderId) {
        if(node.folderId == folderId) {
            return node;
        }
        for(var i = 0; i < node.children?.length; ++i) {
            const ret = this._find(node.children[i], folderId);
            if(ret) {
                return ret;
            }
        }
        return null;
    },

    findNode(root, folderId) {
        for(var i = 0; i < root.length; ++i) {
            const ret = this._find(root[i], folderId);
            if(ret) {
                return ret;
            }
        }
        return null;
    },

    saveDeptFile(folderId, favoriteYn, files) {

        console.log('saveDeptFile', folderId, favoriteYn, files);

        const store = useStore();

        const formData = new FormData();
		formData.append("folderId", folderId);
		formData.append("favoriteYn", favoriteYn);
		for (var i = 0; i < files.length; ++i) {
			formData.append("files", files[i]);
		}

		const apiUrl = `/document/dept/files`;

		return store.API_SAVE_FILE(apiUrl, formData);
    },

    saveMyFile(folderId, favoriteYn, files) {

        console.log('saveMyFile', folderId, favoriteYn, files);

        const store = useStore();

        const formData = new FormData();
		formData.append("folderId", folderId);
		formData.append("favoriteYn", favoriteYn);
		for (var i = 0; i < files.length; ++i) {
			formData.append("files", files[i]);
		}

		const apiUrl = `/document/my/files`;

		return store.API_SAVE_FILE(apiUrl, formData);
    },

    getFileIconClass(fileType) {
        if(fileType === 'pdf') {
            return 'v_ico ico_file_pdf_sm';
        }
        if(fileType === 'ppt' || fileType === 'pptx') {
            return 'v_ico ico_file_ppt_sm';
        }
        if(fileType === 'doc' || fileType === 'docx') {
            return 'v_ico ico_file_doc_sm';
        }
        if(fileType === 'xls' || fileType === 'xlsx') {
            return 'v_ico ico_file_xlsx_sm';
        }
        if(fileType === 'zip') {
            return 'v_ico ico_file_zip_sm';
        }
        if(fileType === 'hwp') {
            return 'v_ico ico_file_hwp_sm';
        }
        if(fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif' || fileType === 'bmp') {
            return 'v_ico ico_file_img_sm';
        }
        return 'v_ico ico_file_etc_sm';
    },

    getFileTypeText(fileType) {
        if(fileType === 'pdf') {
            return 'PDF';
        }
        if(fileType === 'ppt' || fileType === 'pptx') {
            return 'PPT';
        }
        if(fileType === 'doc' || fileType === 'docx') {
            return 'DOC';
        }
        if(fileType === 'xls' || fileType === 'xlsx') {
            return 'XLS';
        }
        if(fileType === 'zip') {
            return 'ZIP';
        }
        if(fileType === 'hwp') {
            return 'HWP';
        }
        if(fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif' || fileType === 'bmp') {
            return 'IMG';
        }
        return 'ETC';
    },

    downloadFile(fileId, fileNm) {
        const store = useStore();
        // const apiUrl = `/document/files/download`;
        store.API_FILE_DOWN(fileId, fileNm);
    },

    download(file) {
        console.log('download', file);

        let fileNm = file.fileTitle;
        if(file.fileType) {
            fileNm += `.${file.fileType}`;
        }
        DocumentService.downloadFile(file.fileId, fileNm);
    },

    updateFile(fileId, fileTitle, favoriteYn) {
        const store = useStore();
        const params = {
            fileId, fileTitle, favoriteYn
        };
        const apiUrl = 'document/files';
        return store.API_UPDATE(apiUrl, params);
    },

    updateFileStar(fileId, favoriteYn) {
        const store = useStore();
        const params = {
            fileId, favoriteYn
        };
        const apiUrl = 'document/files/star';
        return store.API_UPDATE(apiUrl, params);
    },

    updateFolder(folderId, folderNm) {
        const store = useStore();
        const params = {
            folderId, folderNm
        };
        const apiUrl = 'document/folders';
        return store.API_UPDATE(apiUrl, params);
    },

    deleteFolder(folderId) {
        const store = useStore();

        const deleteItems = {
            folderIds: [folderId]
        }
        const apiUrl = 'document/files';
        return store.API_DELETE(apiUrl, deleteItems);
    },

    deleteFile(fileId) {
        const store = useStore();

        const deleteItems = {
            fileGroupIds: [fileId]
        }
        const apiUrl = 'document/files';
        return store.API_DELETE(apiUrl, deleteItems);
    },

    restoreFolder(folderId) {
        const store = useStore();

        const params = {
            folderIds: [folderId]
        }
        const apiUrl = 'document/files/restore';
        return store.API_UPDATE(apiUrl, params);
    },

    restoreFile(fileId) {
        const store = useStore();

        const params = {
            fileGroupIds: [fileId]
        }
        const apiUrl = 'document/files/restore';
        return store.API_UPDATE(apiUrl, params);
    },

    removeFolder(folderId) {
        const store = useStore();

        const deleteItems = {
            folderIds: [folderId]
        }
        const apiUrl = 'document/files/remove';
        return store.API_DELETE(apiUrl, deleteItems);
    },

    removeFile(fileId) {
        const store = useStore();

        const deleteItems = {
            fileGroupIds: [fileId]
        }
        const apiUrl = 'document/files/remove';
        return store.API_DELETE(apiUrl, deleteItems);
    },

    searchFolder(folderTree, search, curFolderId) {
        const root = {
            children: folderTree
        };
        let curFolderFound = !curFolderId;
        for(var i = 0; i < 2; ++i) {
            const ret = this._searchFolder(root, search, curFolderId, curFolderFound);
            if(ret[1] != null) {
                return ret[1];
            }
            curFolderFound = ret[0];
        }
        return null;
    },

    _searchFolder(node, search, curFolderId, curFolderFound) {
        if(curFolderFound && node.folderNm && node.folderNm.includes(search)) {
            return [curFolderFound, node.folderId];
        }
        curFolderFound = curFolderFound || (curFolderId == node.folderId);
        for(var i = 0; i < node.children?.length; ++i) {
            const nn = node.children[i];
            const ret = this._searchFolder(nn, search, curFolderId, curFolderFound);
            if(ret[1] != null) {
                return ret;
            }
            curFolderFound = curFolderFound || ret[0];
        }
        return [curFolderFound, null];
    },

    getThumbnail(item) {
        const apiUrl = `/com/file/down`;
        axios.get(apiUrl, { responseType: 'blob', params: {fileId: item.thumbnail} })
            .then(response => {
                const url = URL.createObjectURL(response.data);
                // console.log('getThumbnail!', url);
                item.thumbnailUrl = url;
            })
            .catch(err => {
                console.error(err);
            })
    },

    getShareFoldersAndFiles(title, regNm) {
        const p1 = this.getShareFolders(title, regNm);
        const p2 = this.getShareFiles(title, regNm);
        return Promise.all([p1, p2]).then(([r1, r2]) => ([...r1, ...r2]));
    },

    getShareFolders(title, regNm) {

        const store = useStore();

        const params = {title, regNm};
        return store.API_LIST('/document/share/folders', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.folderId;
                })
                list.sort(function(a, b) {
                    return a.folderNm.localeCompare(b.folderNm);
                })
                return list;
            });
    },

    getShareFiles(title, regNm) {
        const store = useStore();

        const params = {title, regNm};
        return store.API_LIST('/document/share/files', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getShareFoldersAndFilesByFolderId(folderId, title, regNm) {
        const p1 = this.getShareFoldersByFolderId(folderId, title, regNm);
        const p2 = this.getShareFilesByFolderId(folderId, title, regNm);
        return Promise.all([p1, p2]).then(([r1, r2]) => ([...r1, ...r2]));
    },

    getShareFoldersByFolderId(upperFolderId, title, regNm) {

        const store = useStore();

        const params = {upperFolderId, title, regNm};
        return store.API_LIST('/document/share/folders/content', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.folderId;
                })
                list.sort(function(a, b) {
                    return a.folderNm.localeCompare(b.folderNm);
                })
                return list;
            });
    },

    getShareFilesByFolderId(folderId, title, regNm) {
        const store = useStore();

        const params = {folderId, title, regNm};
        return store.API_LIST('/document/share/files/content', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getStarFiles(title, regNm) {
        const store = useStore();

        const params = {title, regNm};
        return store.API_LIST('/document/star/files', params)
            .then(res => {
                const list = res.data.data;
                list.forEach(item => {
                    item.id = item.fileId;
                })
                list.sort(function(a, b) {
                    return a.fileTitle.localeCompare(b.fileTitle);
                })
                return list;
            });
    },

    getDeptTree() {

        // return NodeService.getDeptTreeNodes();

        const store = useStore();
        
        let param = {
            lang: localStorage.getItem('languageType'),
        }

        return store.API_LIST('admin/dept/tree', param).then((data) => {
            const deptTree = data.data.data;
            return deptTree;
        });

    },

    getDeptList() {
        const store = useStore();
        
        let param = {
            lang: localStorage.getItem('languageType'),
        }

        return store.API_LIST('admin/dept', param).then((data) => {
            const deptList = data.data.data;
            return deptList;
        });
    },

    shareFile(folderYn, folderId, fileGroupId, targetKind, targetId) {
        const store = useStore();
        const params = {
            folderYn, folderId, fileGroupId, targetKind, targetId
        }
        const apiUrl = 'document/files/share';
        return store.API_SAVE(apiUrl, params);
    },

    unshareFile(folderYn, folderId, fileGroupId, targetKind, targetId) {
        const store = useStore();
        const params = {
            folderYn, folderId, fileGroupId, targetKind, targetId
        }
        const apiUrl = 'document/files/unshare';
        return store.API_SAVE(apiUrl, params);
    },

    getShareTargets(folderYn, folderId, fileGroupId, targetKind) {
        const store = useStore();
        const params = {
            folderYn, folderId, fileGroupId, targetKind
        }
        const apiUrl = 'document/files/share';
        return store.API_LIST(apiUrl, params).then(data => {
            const targets = data.data.data;
            return targets;
        })
    },

    getUserList(searchNm) {
        const store = useStore();
        const params = {
            searchNm
        }
        const apiUrl = 'document/files/share/users';
        return store.API_LIST(apiUrl, params).then(data => {
            const ret = data.data.data;
            return ret;
        })
    },

    getDiskSpace() {
        const store = useStore();
        const apiUrl = 'document/files/diskspace';
        return store.API_LIST(apiUrl).then(data => {
            const ret = data.data.data;
            return ret;
        })
    },

    getFolderAuthMapp(folderId, userNm) {
        const store = useStore();
        const params = {
            folderId,
            userNm,
            lang: localStorage.getItem('languageType'),
        }
        const apiUrl = 'document/files/authmapp';
        return store.API_LIST(apiUrl, params).then(data => {
            const ret = data.data.data;
            return ret;
        })
    },

    saveFolderAuthMapp(authMapp) {
        const store = useStore();
        const apiUrl = 'document/files/authmapp';
        return store.API_SAVE(apiUrl, authMapp);
    }

};
