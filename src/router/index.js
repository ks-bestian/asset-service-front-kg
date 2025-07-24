import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';
import { jwtDecode } from 'jwt-decode';
import { useStore } from "@/store";


const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/svtest',
    name: 'svtest',
    component: () => import('@/views/svtest.vue'),
  },
  {
    path: '/firstLogin',
    name: 'firstLogin',
    component: () => import('@/views/firstLoginView.vue'),
  },
  /** 연결된 문서 팝업 */
  { path: '/letter/modal/:docId?', props:true,  name: 'letter.modal.docId', component: () => import('@/views/content/approve/DocumentDetail.vue') },
  {
    path: '/main',
    component: () => import('@/views/MainView.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('@/views/content/main/sampleMain.vue'), 
        /*component: () => import('@/views/content/main/main.vue'),*/
      },
      // {
      //   path: 'list',
      //   component: () => import('@/views/ListView.vue'),
      // },
      {
        path: 'detail1',
        component: () => import('@/views/Detail1View.vue'),
      },
      {
        path: 'tree',
        component: () => import('@/views/TreeTest.vue'),
      },
      {
        path: 'treetable',
        component: () => import('@/views/TreeTableTest.vue'),
      },
      /** 의안제출 */
      /** 제출 */
      { path: 'bill/apply', name: 'bill.apply', component: () => import('@/views/content/bill/billApply/apply/ApplyList.vue') },
      { path: 'bill/apply/save', name: 'bill.apply.save', component: () => import('@/views/content/bill/billApply/apply/ApplySave.vue') },
      { path: 'bill/apply/dtl', name: 'bill.apply.dtl', component: () => import('@/views/content/bill/billApply/apply/ApplyDetail.vue') },
      { path: 'bill/apply/update', name: 'bill.apply.update', component: () => import('@/views/content/bill/billApply/apply/ApplyUpdate.vue') },

      /** 동의 */
      { path: 'bill/agree', name: 'bill.agree', component: () => import('@/views/content/bill/billApply/agree/AgreeList.vue') },
      { path: 'bill/agree/dtl', name: 'bill.agree.dtl', component: () => import('@/views/content/bill/billApply/agree/AgreeDetail.vue') },
      /** 철회 */
      { path: 'bill/revoke', name: 'bill.revoke', component: () => import('@/views/content/bill/billApply/revoke/RevokeList.vue') },
      { path: 'bill/revoke/dtl', name: 'bill.revoke.dtl', component: () => import('@/views/content/bill/billApply/revoke/RevokeDetail.vue') },
      /** 철회동의 */
      { path: 'bill/retractAgree', name: 'bill.retractAgree', component: () => import('@/views/content/bill/billApply/revokeAgree/RevokeAgreeList.vue') },
      { path: 'bill/retractAgree/dtl', name: 'bill.retractAgree.dtl', component: () => import('@/views/content/bill/billApply/revokeAgree/RevokeAgreeDetail.vue') },

      /** 전자결재 */
      { path: 'letter/inbox', name: 'inbox', component: () => import('@/views/content/approve/Inbox.vue') },
      { path: 'letter/approvalInbox', name: 'approvalInbox', component: () => import('@/views/content/approve/ApprovalInbox.vue') },
      { path: 'letter/completedItems', name: 'completedItems', component: () => import('@/views/content/approve/CompletedItems.vue') },
      { path: 'letter/draftsInbox', name: 'draftsInbox', component: () => import('@/views/content/approve/DraftsInbox.vue') },
      { path: 'letter/rejected', name: 'rejected', component: () => import('@/views/content/approve/Rejected.vue') },
      { path: 'letter/executionInbox', name: 'executionInbox', component: () => import('@/views/content/approve/ExecutionInbox.vue') },
      {
        path: 'letter/insert',
        name: 'letter.insert',
        component: () => import('@/views/content/approve/InsertLetter.vue'),
        props: (route) => ({
          docId: route.query.docId || null,
          rcvId: route.query.rcvId ? Number(route.query.rcvId) : null,
          billId: route.query.billId || null,
          aarsDocId: route.query.aarsDocId ? Number(route.query.aarsDocId) : null
        })
      },
      
      { path: 'letter/external/receive', name: 'external.receive', component: () => import('@/views/content/approve/external/ExternalReceive.vue') },
      { path: 'letter/external/send', name: 'external.send', component: () => import('@/views/content/approve/external/ExternalSend.vue')},
      { path: 'letter/external/insert/:externalId?', name: 'external.insert', component: () => import('@/views/content/approve/external/InsertExternal.vue'),
        props: (route) => ({
          externalId : route.params.externalId ?route.params.externalId :null
        })
      },
      { path: 'letter/civilComplaint/insert', name: 'civilComplaint.insert', component: () => import('@/views/content/approve/external/InsertCivilComplaint.vue') },
      { path: 'letter/civilComplaintInbox', name: 'civilComplaint.list', component: () => import('@/views/content/approve/Inbox.vue') },



        /**서식관리 */
        { path: 'system/form', name: 'system.form', component: () => import('@/views/content/template/FormView.vue') },
       // { path: 'form/view', name: 'formView', component: () => import('@/views/content/template/FormView.vue') },
         /**서식관리 */


      /** 2025.02.17
      { path: 'approve/draft', name: 'approve.draft', component: () => import('@/views/content/approve/draft/DraftList.vue') },
      { path: 'approve/sign', name: 'approve.sign', component: () => import('@/views/content/approve/sign/SignList.vue') },
      { path: 'approve/receive', name: 'approve.receive', component: () => import('@/views/content/approve/receive/ReceiveList.vue') },
       */

      /** 의안현황 */
      { path: 'bill/calendar', name: 'bill.calendar', component: () => import('@/views/content/bill/status/BillCalendar.vue') },
      { path: 'bill/status', name: 'bill.status', component: () => import('@/views/content/bill/status/BillStatus.vue') },
      { path: 'bill/voteResult', name: 'bill.voteResult', component: () => import('@/views/content/bill/status/BillVoteResult.vue') },
      // { path: 'bill/voteResult/dtl', name: 'bill.voteResult.dtl', component: () => import('@/views/content/bill/status/BillVoteResultDetail.vue') },

      /** 문서관리 */
      { path: 'document', redirect: {name: 'document.dept'} },
      { path: 'document/dept/:folderId?', name: 'document.dept', component: () => import('@/views/content/document/DocumentDept.vue'), props: true },
      { path: 'document/my/:folderId?', component: () => import('@/views/content/document/DocumentMy.vue'), props: true },
      { path: 'document/share/:folderId?', component: () => import('@/views/content/document/DocumentShare.vue'), props: true },
      { path: 'document/star', component: () => import('@/views/content/document/DocumentStar.vue'), props: true },
      { path: 'document/trash', component: () => import('@/views/content/document/DocumentTrash.vue'), props: true },

      { path: 'sampleDocument', component: () => import('@/views/content/sampleDocument/DocumentMng.vue') },


      /* --마이페이지--*/
      { path: '/myPage/myInfo', name: 'myPage.myInfo', component: () => import('@/views/content/myPage/myInfo/myInfoView.vue') },
      { path: '/myPage/msg', name: 'myPage.msg', component: () => import('@/views/content/myPage/msg/msgList.vue') },
      { path: '/myPage/msg/detail', name: 'myPage.msg.detail', component: () => import('@/views/content/myPage/msg/msgDetail.vue') },
      { path: '/myPage/msg/save', name: 'myPage.msg.save', component: () => import('@/views/content/myPage/msg/msgSave.vue') },



      /* --게시판--*/
      { path: '/notice/board', name: 'notice.board', component: () => import('@/views/content/notice/board/Board.vue') },
      { path: '/notice/board/detail', name: 'notice.board.detail', component: () => import('@/views/content/notice/board/BoardDetail.vue') },
      { path: '/notice/dataRoom', name: 'notice.dataRoom', component: () => import('@/views/content/notice/dataRoom/DataRoom.vue') },
      { path: '/notice/dataRoom/detail', name: 'notice.dataRoom.detail', component: () => import('@/views/content/notice/dataRoom/DataRoomDetail.vue') },
      { path: '/notice/faq', name: 'notice.faq', component: () => import('@/views/content/notice/faq/Faq.vue') },
      { path: '/notice/faq/detail', name: 'notice.faq.detail', component: () => import('@/views/content/notice/faq/FaqDetail.vue') },

      /* 안건심사 */
      /* 안건 관리 New content/billMng*/

      /* 안건 관리 New content/billMng/gdMng gd부서*/
      /* 안건접수*/
      { path: 'billMng/gdMng/billMngRc', name: 'billMng.gdMng.billMngRcList', component: () => import('@/views/content/billMng/gdMng/billMngRcList.vue') },
      { path: 'billMng/gdMng/billMngRc/Dtl', name: 'billMng.gdMng.billMngRcDtl', component: () => import('@/views/content/billMng/gdMng/billMngRcDtl.vue'), props: true },
      { path: 'billMng/gdMng/billMngRc/save', name: 'billMng.gdMng.billMngRcSave', component: () => import('@/views/content/billMng/gdMng/billMngSave.vue'), props: true },
      
      /* 위원회회부*/
      { path: 'billMng/gdMng/billMngCmt', name: 'billMng.gdMng.billMngCmt', component: () => import('@/views/content/billMng/gdMng/billMngCmtList.vue') },
      { path: 'billMng/gdMng/billMngCmt/Dtl', name: 'billMng.gdMng.billMngCmt.dtl', component: () => import('@/views/content/billMng/gdMng/billMngCmtDtl.vue'), props: true },
      /* 본회의장부의*/
      { path: 'billMng/gdMng/billMngMainMtSubmit', name: 'billMng.gdMng.billMngMainMtSubmit', component: () => import('@/views/content/billMng/gdMng/billMngMainMtSubmitList.vue') },
      { path: 'billMng/gdMng/billMngMainMtSubmit/Dtl', name: 'billMng.gdMng.billMngMainMtSubmit.dtl', component: () => import('@/views/content/billMng/gdMng/billMngMainMtSubmitDtl.vue') },
      
      /* 안건 관리 New content/billMng/billMngList 법률검토부서*/
      { path: 'billMng/lgReviewMng/billMng', name: 'billMng.lgReviewMng.billMngList', component: () => import('@/views/content/billMng/lgReviewMng/billMngList.vue') },
      { path: 'billMng/lgReviewMng/billMng/Dtl', name: 'billMng.lgReviewMng.billMngDtl', component: () => import('@/views/content/billMng/lgReviewMng/billMngDtl.vue'), props: true },

      /* 안건 관리 New content/langReviewMng/billMngList 언어전문부서*/
      { path: 'billMng/langReviewMng/billMng', name: 'billMng.langReviewMng.billMngList', component: () => import('@/views/content/billMng/langReviewMng/billMngList.vue') },
      { path: 'billMng/langReviewMng/billMng/Dtl', name: 'billMng.langReviewMng.billMngDtl', component: () => import('@/views/content/billMng/langReviewMng/billMngDtl.vue'), props: true },

      /* 안건 관리 New content/lgExntnMng/billMngList 법률심사부서*/
      { path: 'billMng/lgExntnMng/billMng', name: 'billMng.lgExntnMng.billMngList', component: () => import('@/views/content/billMng/lgExntnMng/billMngList.vue') },
      { path: 'billMng/lgExntnMng/billMng/Dtl', name: 'billMng.lgExntnMng.billMngDtl', component: () => import('@/views/content/billMng/lgExntnMng/billMngDtl.vue'), props: true },

      /* 안건 관리 New content/legalActMng/billMngList 법적행위부서*/
      { path: 'billMng/legalActMng/billMng', name: 'billMng.legalActMng.billMngList', component: () => import('@/views/content/billMng/legalActMng/billMngList.vue') },
      { path: 'billMng/legalActMng/billMng/Dtl', name: 'billMng.legalActMng.billMngDtl', component: () => import('@/views/content/billMng/legalActMng/billMngDtl.vue'), props: true },

      /* 안건 관리 New content/gvrnTrsfMng/billMngList 정부이송*/
      { path: 'billMng/gvrnTrsfMng/billMng', name: 'billMng.gvrnTrsfMng.billMngList', component: () => import('@/views/content/billMng/gvrnTrsfMng/billMngList.vue') },
      { path: 'billMng/gvrnTrsfMng/billMng/Dtl', name: 'billMng.gvrnTrsfMng.billMngDtl', component: () => import('@/views/content/billMng/gvrnTrsfMng/billMngDtl.vue'), props: true },

      /* 안건 관리 New content/prmgMng/billMngList 공포*/
      { path: 'billMng/prmgMng/billMng', name: 'billMng.prmgMng.billMngList', component: () => import('@/views/content/billMng/prmgMng/billMngList.vue') },
      { path: 'billMng/prmgMng/billMng/Dtl', name: 'billMng.prmgMng.billMngDtl', component: () => import('@/views/content/billMng/prmgMng/billMngDtl.vue'), props: true },

      /* 안건 관리  소관위원회*/
      { path: 'billMng/cmtMng/billCmtReview', name: 'billMng.cmtMng.billCmtReviewList', component: () => import('@/views/content/billMng/cmtMng/billCmtReviewList.vue') },
      { path: 'billMng/cmtMng/billCmtReview/Dtl', name: 'billMng.cmtMng.billCmtReviewDtl', component: () => import('@/views/content/billMng/cmtMng/billCmtReviewDtl.vue'), props: true },

      /* 안건 관리  관련위원회*/
      // { path: 'billMng/cmtMng/billRefCmtReview', name: 'billMng.cmtMng.billRefCmtReviewList', component: () => import('@/views/content/billMng/cmtMng/billRefCmtReviewList.vue') },
      { path: 'billMng/cmtMng/billRefCmtReview/Dtl', name: 'billMng.cmtMng.billRefCmtReviewDtl', component: () => import('@/views/content/billMng/cmtMng/billRefCmtReviewDtl.vue'), props: true },

      
      /* 회의관리 */
      { path: 'mtng/cmtMtng', name: 'mtng.cmtMtng', component: () => import('@/views/content/billMng/mtngMng/cmtMtngList.vue') },
      { path: 'mtng/cmtMtng/create', name: 'mtng.cmtMtng.create', component: () => import('@/views/content/billMng/mtngMng/cmtMtngCreate.vue')},
      { path: 'mtng/cmtMtng/detail', name: 'mtng.cmtMtng.detail', component: () => import('@/views/content/billMng/mtngMng/cmtMtngDetail.vue')},
      { path: 'mtng/cmtMtng/update', name: 'mtng.cmtMtng.update', component: () => import('@/views/content/billMng/mtngMng/cmtMtngUpdate.vue')},
      { path: 'mtng/cmtMtng/result', name: 'mtng.cmtMtng.result', component: () => import('@/views/content/billMng/mtngMng/cmtMtngResult.vue')},

      { path: 'mtng/mainMtng1', name: 'mtng.mainMtng', component: () => import('@/views/content/billMng/mtngMng/mainMtngList.vue') },
      { path: 'mtng/mainMtng1/create', name: 'mtng.mainMtng.create', component: () => import('@/views/content/billMng/mtngMng/mainMtngCreate.vue')},
      { path: 'mtng/mainMtng1/detail', name: 'mtng.mainMtng.detail', component: () => import('@/views/content/billMng/mtngMng/mainMtngDetail.vue')},
      { path: 'mtng/mainMtng1/update', name: 'mtng.mainMtng.update', component: () => import('@/views/content/billMng/mtngMng/mainMtngUpdate.vue')},
      

      { path: 'mtng/mainMtngResult', name: 'mtng.mainMtngResult', component: () => import('@/views/content/billMng/mtngMng/mainMtngResultList.vue') },
     // { path: 'mtng/mainMtng2/detail', name: 'mtng.mainMtng2.detail', component: () => import('@/views/content/billMng/mtngMng/mainMtngDetail2.vue')},
      //{ path: 'mtng/mainMtng2/result', name: 'mtng.mainMtng2.result', component: () => import('@/views/content/billMng/mtngMng/mainMtngResult.vue')},

      { path: 'mtng/allMtng', name: 'mtng.allMtng', component: () => import('@/views/content/billMng/mtngMng/allMtngList.vue') },
      { path: 'mtng/allMtng/detail', name: 'mtng.allMtng.detail', component: () => import('@/views/content/billMng/mtngMng/allMtngDetail.vue')},



      /* 안건전체 */
      { path: 'billMng/billSearch/billAllList', name: 'billMng.billSearch.billAllList', component: () => import('@/views/content/billMng/billSearch/billAllList.vue') },
      { path: 'billMng/billSearch/billAllList/dtl/:billId', name: 'billMng.billSearch.billAllList.dtl', component: () => import('@/views/content/billMng/billSearch/billAllDetail.vue'), props: true },
      /**안건모니터링 */
      { path: 'billMng/billSearch/billMonitorList', name: 'billMng.billSearch.billMonitorList', component: () => import('@/views/content/billMng/billSearch/billMonitorList.vue') },
      { path: 'billMng/billSearch/billMonitorList/dtl/:billId', name: 'billMng.billSearch.billMonitorList.dtl', component: () => import('@/views/content/billMng/billSearch/billMonitorDetail.vue'), props: true },
      

      /* 안건검색 */
      /**안건상세검색 */
      { path: 'billMng/billSearch/billDetailSearchList', name: 'billMng.billSearch.billDetailSearchList', component: () => import('@/views/content/billMng/billSearch/billDetailSearchList.vue') },
      { path: 'billMng/billSearch/billDetailSearchList/dtl/:billId', name: 'billMng.billSearch.billDetailSearchList.dtl', component: () => import('@/views/content/billMng/billSearch/billDetailSearchDetail.vue'), props: true },
      /**안건검색 Engine Pro Ten */
      { path: 'billMng/billSearch/billSearchEngineList', name: 'billMng.billSearch.billSearchEngineList', component: () => import('@/views/content/billMng/billSearch/billSearchEngineList.vue') },
      { path: 'billMng/billSearch/billSearchEngineList/dtl/:billId/:searchWord', name: 'billMng.billSearch.billSearchEngineList.dtl', component: () => import('@/views/content/billMng/billSearch/billSearchEngineDetail.vue'), props: true },

      //자산관리
      { path: 'asset/mng', name: 'asset.mng', component: () => import('@/views/content/asset/mng/AssetMng.vue'), },
      { path: 'asset/mng/form/:eqpmntId/:type', name: 'asset.mng.form', props: true, component: () => import('@/views/content/asset/mng/AssetCreate.vue'), },
      { path: 'asset/mng/dtl/:eqpmntId', name: 'asset.mng.dtl', props: true, component: () => import('@/views/content/asset/mng/AssetDetail.vue'), },
      //업체관리
      { path: 'asset/bzenty', name: 'asset.bzenty', component: () => import('@/views/content/bzenty/BzentyList.vue'), },
      { path: 'asset/bzenty/create', name: 'asset.bzenty.create', component: () => import('@/views/content/bzenty/BzentyCreate.vue'), },
      { path: 'asset/bzenty/detail', name: 'asset.bzenty.detail', component: () => import('@/views/content/bzenty/BzentyDetail.vue')},
      

            
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////















      /* --관리자--*/
      /* 게시판관리 */
      { path: 'system/notice', name: 'system.notice', component: () => import('@/views/system/notice/NoticeView.vue') },
      { path: 'system/notice/detail', name: 'system.notice.detail', component: () => import('@/views/system/notice/NoticeDetailView.vue') },
      { path: 'system/notice/save', name: 'system.notice.save', component: () => import('@/views/system/notice/NoticeSaveView.vue') },

      /* 사용자관리*/
      { path: 'system/user', name: 'system.user', component: () => import('@/views/system/user/UserList.vue') },
      { path: 'system/user/detail', name: 'system.user.detail', component: () => import('@/views/system/user/UserDetail.vue') },
      { path: 'system/user/save', name: 'system.user.save', component: () => import('@/views/system/user/UserCreate.vue') },
      { path: 'system/user/member/detail', name: 'system.member.detail', component: () => import('@/views/system/user/MemberDetail.vue') },
      { path: 'system/user/member/save', name: 'system.member.save', component: () => import('@/views/system/user/MemberCreate.vue') },
      /* 부서관리 */
      { path: 'system/dept', name: 'system.dept', component: () => import('@/views/system/dept/DeptList.vue') },
      /* 위원회관리 */
      { path: 'system/cmit', name: 'system.cmit', component: () => import('@/views/system/cmit/CmitList.vue') },
      /* 접속이력 */
      { path: 'system/acsHist', name: 'system.acsHist', component: () => import('@/views/system/acsHist/AcsHistView.vue') },
       /* 안건접속이력 */
       { path: 'system/billAcsHist', name: 'system.billAcsHist', component: () => import('@/views/system/acsHist/BillAcsHist.vue') },
      /* 대별코드관리 */
      { path: 'system/baseCode', name: 'system.baseCode', component: () => import('@/views/system/baseCode/BaseCodeList.vue') },
      /* 코드관리 */
      { path: 'system/comCode', name: 'system.comCode', component: () => import('@/views/system/comCode/ComCodeList.vue') },


      /* 언어관리 */
      { path: 'system/lngCode', name: 'system.lngCode', component: () => import('@/views/system/lngCode/LngCodeList.vue') },
      { path: 'system/lngCode/detail', name: 'system.lngCode.detail', component: () => import('@/views/system/lngCode/LngCodeDetail.vue'), props: true },
      /* 서식관리 */
      //{ path: 'system/form', name: 'system.form', component: () => import('@/views/system/form/FormView.vue') },
      { path: 'system/form/detail', name: 'system.form.detail', component: () => import('@/views/system/form/FormDetailView.vue') },
      { path: 'system/form/save', name: 'system.form.save', component: () => import('@/views/system/form/FormSaveView.vue') },
      /* 메뉴관리 */
      { path: 'system/menu', name: 'system.menu', component: () => import('@/views/system/menu/MenuList.vue') },
      /* 권한별부서관리 */
       { path: 'system/auth/authDept', name: 'system.auth.authDept', component: () => import('@/views/system/auth/authDept/AuthDeptList.vue') },
      /* 권한별메뉴관리 */
      // { path: 'system/auth/authMenu', name: 'system.auth.authMenu', component: () => import('@/views/system/auth/authMenu/AuthMenuList.vue') },
      // { path: 'system/auth/authMenu/sample', name: 'system.auth.authMenu.sample', component: () => import('@/views/system/auth/authMenu/AuthMenuViewSample.vue') },
      // /* 권한별사용자관리 */
      // { path: 'system/auth/authUser', name: 'system.auth.authUser', component: () => import('@/views/system/auth/authUser/AuthUserList.vue') },

      // // SED데이터
      // { path: 'system/sed', name: 'system.sed', component: () => import('@/views/system/sed/SedList.vue')},
      // { path: 'system/sed/dtl', name: 'system.sed.dtl', component: () => import('@/views/system/sed/SedDetail.vue')},

      //기록물철
      //{ path: 'data/archive', name: 'data.archive', component: () => import('@/views/content/bill/archive/ArchiveList.vue')},
      //{ path: 'data/archive/dtl', name: 'data.archive.dtl', component: () => import('@/views/content/bill/archive/ArchiveDetail.vue')},

    ]
  },
];


const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history: createWebHistory(),
  routes,
});

export function checkTokenValidity() {
  // 쿠키에서 토큰 가져오기
  // const token = VueCookies.get('jwtToken');
  const store = useStore();
  const token = store.jwtToken;
  if (!token) {
    //console.log('토큰이 존재하지 않습니다.');
    // store.loginInfo = null;
    store.reset();
    return false;
  }

  // JWT 디코딩하여 payload 추출
  const decodedToken = jwtDecode(token);
  //console.log('Decoded Token:', decodedToken);

  // 토큰의 만료 시간 가져오기 (만료 시간은 'exp' 필드에 있음)
  const tokenExpiration = decodedToken.exp;
  const currentTimestamp = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위 타임스탬프)
  //console.log('currentTimestamp:', currentTimestamp);
  // 만료 시간 비교
  if (currentTimestamp > tokenExpiration) {
    //console.log('토큰이 만료되었습니다.');
    // 만료된 토큰 처리: 로그아웃 등의 동작 수행
    // VueCookies.remove('jwtToken');
    
    const store = useStore();
    // store.loginInfo = null;
    store.reset();
    // store.dispatch('updateUser', { userId: null, token: null, loginInfo: null });
    alert('로그인 정보가 만료 되었습니다. 다시 로그인 해주십시오.');
    return false;
  } else {
    //console.log('토큰이 유효합니다.');
    return true;
  }
}

function getMenuList() {
  const store = useStore();
  let params = { lang: localStorage.getItem('languageType'), type: 'menu', menuList: 'sideBar' }
  return store.API_LIST('/admin/deptmenu', params).then((data) => data.data.data);
}

async function isAuthorized(menuPath) {
  if(menuPath === '/main' || menuPath === '/') {
    return true;
  }
  const menuList = await getMenuList();
  for(var i = 0; i < menuList.length; ++i) {
    if(_isAuthorized(menuList[i], menuPath)) {
      return true;
    }
  }
  return false;
}

function _isAuthorized(node, menuPath) {
  if(node.menuPath && menuPath.startsWith(node.menuPath)) {
    return true;
  }
  let ret = false;
  for(var i = 0; i < node.children?.length; ++i) {
    const child = node.children[i];
    ret = ret || _isAuthorized(child, menuPath);
  }
  return ret;
}

router.beforeEach(async (to, from, next) => {

  localStorage.setItem("LS_MENU_PATH", to.path);

  // 모든 경로에 대해 토큰 유효성 검사 수행
  const isTokenValid = checkTokenValidity();

  // 메뉴접근권한 검사
  // const authorized = isTokenValid && await isAuthorized(to.path);

  if (to.path === '/') {
    // 로그인 페이지로 이동하려는 경우
    if (!isTokenValid) {
      next();
    } else {
      next('/main');
    }

  } else {
    
    // 로그인 상태가 아니면 로그인 페이지로 리디렉션
    if (!isTokenValid) {
      next('/');
    }
    // else if(!authorized) {
    //   const store = useStore();
    //   store.toast.add({ severity: 'error', summary: 'Error', detail: 'Unauthorized access', life: 60000 });
    //   next('/');
    // }
    else {
      next();
    }

  }

});

export default router
