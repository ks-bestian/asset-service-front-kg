import { read } from "xlsx-js-style";

export const NodeService = {
    getTreeNodesData() {
        return [
            {
                key: '0',
                label: 'I. 사업관리',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    {
                        key: '0-0',
                        label: '보고 및 업무',
                        data: 'Work Folder',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            {
                                key: '0-0-0', label: '보고(KOICA)', icon: 'pi pi-fw pi-folder', data: 'Expenses Document',
                                children: [
                                    { key: '0-0-0-1', label: '보고1', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                    { key: '0-0-0-2', label: '보고2', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                ]
                            },
                            {
                                key: '0-0-1', label: '사진', icon: 'pi pi-fw pi-folder', data: 'Expenses Document',
                                children: [
                                    { key: '0-0-1-1', label: '사진1', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                    { key: '0-0-1-2', label: '사진2', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                ]
                            },
                            { key: '0-0-2', label: '수집자료', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                            { key: '0-0-3', label: '일일보고', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                        ]
                    },
                    { key: '0-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-3', label: '착수조사 계획', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-4', label: '품질 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-5', label: '홍보 영상 제작', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                ]
            },
            {
                key: '1',
                label: 'VI. 역량강화',
                data: 'Events Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '1-0', label: '보고 및 업무', icon: 'pi pi-fw pi-folder', data: 'Meeting' },
                    { key: '1-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Product Launch' },
                    { key: '1-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Report Review' }
                ]
            },
            {
                key: '2',
                label: 'VII.기타 자료',
                data: 'Movies Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '2-0', label: '보고 및 업무', icon: 'pi pi-fw pi-folder', data: 'Meeting' },
                    { key: '2-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Product Launch' },
                    { key: '2-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Report Review' }
                ]
            }
        ];
    },

    getTreeTableNodesData() {
        return [
            {
                key: '0',
                data: {
                    name: 'Applications',
                    size: '100kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '0-0',
                        data: {
                            name: 'Vue',
                            size: '25kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '0-0-0',
                                data: {
                                    name: 'vue.app',
                                    size: '10kb',
                                    type: 'Application'
                                }
                            },
                            {
                                key: '0-0-1',
                                data: {
                                    name: 'native.app',
                                    size: '10kb',
                                    type: 'Application'
                                }
                            },
                            {
                                key: '0-0-2',
                                data: {
                                    name: 'mobile.app',
                                    size: '5kb',
                                    type: 'Application'
                                }
                            }
                        ]
                    },
                    {
                        key: '0-1',
                        data: {
                            name: 'editor.app',
                            size: '25kb',
                            type: 'Application'
                        }
                    },
                    {
                        key: '0-2',
                        data: {
                            name: 'settings.app',
                            size: '50kb',
                            type: 'Application'
                        }
                    }
                ]
            },
            {
                key: '1',
                data: {
                    name: 'Cloud',
                    size: '20kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '1-0',
                        data: {
                            name: 'backup-1.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    },
                    {
                        key: '1-1',
                        data: {
                            name: 'backup-2.zip',
                            size: '10kb',
                            type: 'Zip'
                        }
                    }
                ]
            },
            {
                key: '2',
                data: {
                    name: 'Desktop',
                    size: '150kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '2-0',
                        data: {
                            name: 'note-meeting.txt',
                            size: '50kb',
                            type: 'Text'
                        }
                    },
                    {
                        key: '2-1',
                        data: {
                            name: 'note-todo.txt',
                            size: '100kb',
                            type: 'Text'
                        }
                    }
                ]
            },
            {
                key: '3',
                data: {
                    name: 'Documents',
                    size: '75kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '3-0',
                        data: {
                            name: 'Work',
                            size: '55kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '3-0-0',
                                data: {
                                    name: 'Expenses.doc',
                                    size: '30kb',
                                    type: 'Document'
                                }
                            },
                            {
                                key: '3-0-1',
                                data: {
                                    name: 'Resume.doc',
                                    size: '25kb',
                                    type: 'Resume'
                                }
                            }
                        ]
                    },
                    {
                        key: '3-1',
                        data: {
                            name: 'Home',
                            size: '20kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '3-1-0',
                                data: {
                                    name: 'Invoices',
                                    size: '20kb',
                                    type: 'Text'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '4',
                data: {
                    name: 'Downloads',
                    size: '25kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '4-0',
                        data: {
                            name: 'Spanish',
                            size: '10kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '4-0-0',
                                data: {
                                    name: 'tutorial-a1.txt',
                                    size: '5kb',
                                    type: 'Text'
                                }
                            },
                            {
                                key: '4-0-1',
                                data: {
                                    name: 'tutorial-a2.txt',
                                    size: '5kb',
                                    type: 'Text'
                                }
                            }
                        ]
                    },
                    {
                        key: '4-1',
                        data: {
                            name: 'Travel',
                            size: '15kb',
                            type: 'Text'
                        },
                        children: [
                            {
                                key: '4-1-0',
                                data: {
                                    name: 'Hotel.pdf',
                                    size: '10kb',
                                    type: 'PDF'
                                }
                            },
                            {
                                key: '4-1-1',
                                data: {
                                    name: 'Flight.pdf',
                                    size: '5kb',
                                    type: 'PDF'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                key: '5',
                data: {
                    name: 'Main',
                    size: '50kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '5-0',
                        data: {
                            name: 'bin',
                            size: '50kb',
                            type: 'Link'
                        }
                    },
                    {
                        key: '5-1',
                        data: {
                            name: 'etc',
                            size: '100kb',
                            type: 'Link'
                        }
                    },
                    {
                        key: '5-2',
                        data: {
                            name: 'var',
                            size: '100kb',
                            type: 'Link'
                        }
                    }
                ]
            },
            {
                key: '6',
                data: {
                    name: 'Other',
                    size: '5kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '6-0',
                        data: {
                            name: 'todo.txt',
                            size: '3kb',
                            type: 'Text'
                        }
                    },
                    {
                        key: '6-1',
                        data: {
                            name: 'logo.png',
                            size: '2kb',
                            type: 'Picture'
                        }
                    }
                ]
            },
            {
                key: '7',
                data: {
                    name: 'Pictures',
                    size: '150kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '7-0',
                        data: {
                            name: 'barcelona.jpg',
                            size: '90kb',
                            type: 'Picture'
                        }
                    },
                    {
                        key: '7-1',
                        data: {
                            name: 'primevue.png',
                            size: '30kb',
                            type: 'Picture'
                        }
                    },
                    {
                        key: '7-2',
                        data: {
                            name: 'prime.jpg',
                            size: '30kb',
                            type: 'Picture'
                        }
                    }
                ]
            },
            {
                key: '8',
                data: {
                    name: 'Videos',
                    size: '1500kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '8-0',
                        data: {
                            name: 'primefaces.mkv',
                            size: '1000kb',
                            type: 'Video'
                        }
                    },
                    {
                        key: '8-1',
                        data: {
                            name: 'intro.avi',
                            size: '500kb',
                            type: 'Video'
                        }
                    }
                ]
            }
        ];
    },

    getDeptTreeNodesData() {
        return [
            {
                key: 'M10000',
                label: 'Конгресс (국회)',
                icon: 'pi pi-fw pi-folder',
                children: [
                    {
                        key: 'M10010',
                        label: 'Улуттук ассамблеянын спикери (국회의장단)',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            { key: '0-0-0', label: 'врачтын кабинети (의사국)', icon: 'pi pi-fw pi-folder' },
                            { key: '0-0-1', label: 'дарыгер бөлүмү (의사과)', icon: 'pi pi-fw pi-folder' }
                        ]
                    },
                    {
                        key: 'M10011',
                        label: 'Улуттук Ассамблеянын секретариаты (국회사무처)',
                        icon: 'pi pi-fw pi-folder',
                        children: [{ key: '0-1-0', label: 'кеңсе1(사무처1)', icon: 'pi pi-fw pi-folder' }]
                    }
                ]
            },
            {
                key: 'M20000',
                label: 'Жалпы бөлүм(일반부서)',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: 'M20010', label: 'Ченемдик укуктук актыларды ишке ашыруучу бөлүм(규제 법률 행위 발생 부서)', icon: 'pi pi-fw pi-folder', data: 'Meeting' },
                    { key: 'M20011', label: 'Энергетика жана минералдык ресурстар комитети(에너지 및 광물 자원 부서)', icon: 'pi pi-fw pi-folder', data: 'Product Launch' },
                    { key: 'M20012', label: 'Системаны башкаруу бөлүмү(시스템관리부서)', icon: 'pi pi-fw pi-folder', data: 'Report Review' }
                ]
            },
            {
                key: 'M30000',
                label: 'конгрессмендин кеңсеси(의원실)',
                icon: 'pi pi-fw pi-folder',
                children: [
                    {
                        key: 'M30010',
                        icon: 'pi pi-fw pi-folder',
                        label: 'Исаева Джамиля Кубанычбековна конгрессмендин кеңсеси',
                    },
                    {
                        key: 'M30011',
                        label: 'Исаева Джамиля Кубанычбековна конгрессмендин кеңсеси',
                        icon: 'pi pi-fw pi-folder',
                    }
                ]
            }
        ];
    },

    getMenuTreeNodesData() {
        return [
            {
                key: '1',
                label: 'Мыйзам долбоорун сунуштоо(의안제출)',
                children: [
                    { key: '11', label: 'Маселени киргизүү(안건제출)' },
                    { key: '12', label: 'Маселени колдоо(안건동의)' } ,
                    { key: '13',  label: 'Маселени артка кайтаруу(안건철회제출)' },
                    { key: '14',  label: 'Маселени артка кайтарууну колдоо(안건철회동의)' },
                ]
            },
            {
                key: '2',
                label: ' Маселени карап чыгуу(안건심사)',
                children: [
                    { key: '21', label: 'Бардык маселелер(안건전체)' },
                    { key: '22', label: 'Маселени башкаруу(안건관리)' },
                    { key: '22', label: 'Юридикалык кароо(법률검토)' },
                    { key: '22', label: 'пикир кагазы (의견서)' },
                    { key: '22', label: 'Жооптуу комитет(소관위)' },
                    { key: '22', label: 'Байланыштуу комитет(관련위)'},
                    { key: '22', label: 'Башкы жыйындын текшерүүсү(본회의검증)' },
                ]
            },
            {
                key: '3',
                label: 'Комитеттин жыйыны(위원회회의)',
                children: [
                    { key: '31', label: 'Пландалган жыйындар(회의예정)' },
                    { key: '32', label: 'Жыйындын жыйынтыгы(회의결과)',  },
                    { key: '32', label: 'Жыйындын маалыматын көрүү(회의조회)', },
                ]
            },
            {
                key: '4',
                label: 'Электрондук бекитүү(전자결제)',
                children: [
                    { key: '41', label: 'Долбоордук документтер(기인함)', },
                    { key: '42', label: 'Бекитүү кутучасы(결재함)', },
                    { key: '43', label: 'Кабыл алуу кутучасы(수신함)', },
                    { key: '44', label: 'Архив папкасы(기록물철)',},
                ]
            },

            {
                key: '5',
                label: 'Мыйзам долбоорунун абалы(의안현황)',
                children: [
                    { key: '51', label: 'күн тартиби (의사일정)', },
                    { key: '52', label: 'Маселе мониторинги(의안모니터링)' },
                    { key: '53', label: 'статистика(의안통계)', },
                    { key: '54', label: 'Жалпы жыйындын добуш берүү маалыматы(본회의표결정보)', },
                ]
            },
            {
                key: '6',
                label: 'документ башкаруу(문서관리)',
                children: [
                    { key: '61', label: 'документ башкаруу(문서관리)' },
                ]
            },
            {
                key: '7',
                label: 'Маселени издөө(안건검색)',
                children: [
                    { key: '71', label: 'Кененирээк издөө(상세검색)' },
                    { key: '72', label: 'Жалпы издөө(통합검색)' },
                ]
            },
            {
                key: '8',
                label: 'Менин баракчам(마이페이지)',
                children: [
                    { key: '81', label: 'менин маалыматым(나의정보)' },
                    { key: '82', label: 'Билдирүү башкаруу(메세지관리)' },
                ]
            },
            {
                key: '9',
                label: 'эскертүү тактасы(게시판)',
                children: [
                    { key: '91', label: 'кулактандыруу(공지사항)'},
                    { key: '92', label: 'маалымат бөлмөсү(자료실)' },
                    { key: '93', label: 'FAQ' },
                ]
            },
            {
                key: '10',
                label: '(관리자)',
                children: [
                    { key: '100', label: 'Маалымат тактасын башкаруу(게시판관리)',},
                    { key: '101', label: 'Колдонуучуну башкаруу(사용자관리)',},
                    { key: '102', label: 'Бөлүм башкаруу(부서관리)',  },
                    { key: '103', label: 'Туташуу тарыхы(접속이력)',  },
                    { key: '104', label: 'Негизги коддорду башкаруу(대별코드관리)',  },
                    { key: '105', label: 'Коддорду башкаруу(코드관리)',  },
                    { key: '106', label: 'Күн тартибин башкаруу(안건관리)',   },
                    { key: '107', label: 'SED маалыматтары(SED데이터)',  },
                    { key: '108', label: 'Шаблондорду башкаруу(서식관리)',  },
                    { key: '109', label: 'Тилди башкаруу(언어관리)',  },
                    { key: '110', label: 'Меню башкаруу(메뉴관리)',  },
                    { key: '111', label: 'Укуктарга жараша меню башкаруу(권한별메뉴관리)',  },
                    { key: '112', label: 'Колдонуучуну бийлик тарабынан башкаруу(권한별사용자관리)',   },
                ]
            },
        ];
    },


    getAuthMenuTreeNodesData() {
        return [
            {
                key: '0',
                data: {
                    label: 'Мыйзам долбоорун сунуштоо(의안제출)',
                    url: 'bill/apply',
                    read: false,
                    cud: false,
                },
                children: [
                    { key: '0-0', data: { label: 'Маселени киргизүү(안건제출)', url: 'bill/apply/dtl', read: false } },
                    { key: '0-1', data: { label: 'Маселени колдоо(안건동의)', url: 'bill/agree' } },
                    { key: '0-2', data: { label: 'Маселени артка кайтаруу(안건철회제출)', url: 'bill/revoke' } },
                    { key: '0-3', data: { label: 'Маселени артка кайтарууну колдоо(안건철회동의)', url: 'bill/revoke/agree' } },
                ]
            },
            {
                key: '1',
                data: {
                    label: 'Маселени карап чыгуу(안건심사)',
                    url: 'bill/audit'
                },
                children: [
                    { key: '1-0', data: { label: 'Бардык маселелер(안건전체)', url: 'bill/all' } },
                    { key: '1-1', data: { label: 'Маселени башкаруу(안건관리)', url: 'bill/manege' } },
                    { key: '1-2', data: { label: 'Юридикалык кароо (법률검토)', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'пикир кагазы (의견서)', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Жооптуу комитет(소관위)', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Байланыштуу комитет(관련위)', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Башкы жыйындын текшерүүсү(본회의검증)', url: 'bill/apply' } },
                ]
            },
            {
                key: '2',
                data: {
                    label: 'Комитеттин жыйыны(위원회회의)',
                    url: 'bill/cmt/meeting'
                },
                children: [
                    { key: '2-0', data: { label: 'Пландалган жыйындар(회의예정)', url: 'bill/meeting/expected' } },
                    { key: '2-1', data: { label: 'Жыйындын жыйынтыгы(회의결과)', url: 'bill/meeting/result' } },
                    { key: '2-2', data: { label: 'Жыйындын маалыматын көрүү(회의조회)', url: 'bill/meeting/read' } },
                ]
            },
            {
                key: '4',
                data: {
                    label: 'Электрондук бекитүү(전자결제)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '4-0', data: { label: 'Долбоордук документтер(기인함)', url: 'bill/calendar' } },
                    { key: '4-1', data: { label: 'Бекитүү кутучасы(결재함)', url: 'bill/monitoring' } },
                    { key: '4-2', data: { label: 'Кабыл алуу кутучасы(수신함)', url: 'bill/statistic' } },
                    { key: '4-2', data: { label: 'Архив папкасы(기록물철)', url: 'bill/statistic' } },
                ]
            },
            {
                key: '3',
                data: {
                    label: 'Мыйзам долбоорунун абалы(의안현황)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '3-0', data: { label: 'күн тартиби (의사일정)', url: 'bill/calendar' } },
                    { key: '3-1', data: { label: 'Маселе мониторинги(안건모니터링)', url: 'bill/monitoring' } },
                    { key: '3-2', data: { label: 'статистика (의안통계)', url: 'bill/statistic' } },
                    { key: '3-3', data: { label: 'Жалпы жыйындын добуш берүү маалыматы(본회의표결정보)', url: 'bill/apply' } },
                ]
            },
            {
                key: '5',
                data: {
                    label: 'документ башкаруу(문서관리)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '5-0', data: { label: 'документ башкаруу(문서관리)', url: 'bill/calendar' } },
                ]
            },
            {
                key: '6',
                data: {
                    label: 'Маселени издөө(안건검색)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '6-0', data: { label: 'Кененирээк издөө(상세검색)', url: 'bill/calendar' } },
                    { key: '6-1', data: { label: 'Жалпы издөө(통합검색)', url: 'bill/calendar' } },
                ]
            },
            {
                key: '7',
                data: {
                    label: 'Менин баракчам(마이페이지)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '7-0', data: { label: 'менин маалыматым(나의정보)', url: 'bill/calendar' } },
                    { key: '7-1', data: { label: 'Билдирүү башкаруу(메세지관리)', url: 'bill/calendar' } },
                ]
            },
            {
                key: '8',
                data: {
                    label: 'эскертүү тактасы(게시판)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '8-0', data: { label: 'кулактандыруу(공지사항)', url: 'bill/calendar' } },
                    { key: '8-1', data: { label: 'маалымат бөлмөсү(자료실)', url: 'bill/calendar' } },
                    { key: '8-2', data: { label: 'FAQ', url: 'bill/calendar' } },
                ]
            },
            {
                key: '9',
                data: {
                    label: 'Администратор(관리자)'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '9-0', data: { label: 'Маалымат тактасын башкаруу(게시판관리)', url: 'bill/calendar' } },
                    { key: '9-1', data: { label: 'Колдонуучуну башкаруу(사용자관리)', url: 'bill/calendar' } },
                    { key: '9-2', data: { label: 'Бөлүм башкаруу(부서관리)', url: 'bill/calendar' } },
                    { key: '9-3', data: { label: 'Туташуу тарыхы(접속이력)', url: 'bill/calendar' } },
                    { key: '9-4', data: { label: 'Негизги коддорду башкаруу(대별코드관리)', url: 'bill/calendar' } },
                    { key: '9-5', data: { label: 'Коддорду башкаруу(코드관리)', url: 'bill/calendar' } },
                    { key: '9-6', data: { label: 'Күн тартибин башкаруу(안건관리)', url: 'bill/calendar' } },
                    { key: '9-7', data: { label: 'SED маалыматтары(SED데이터)', url: 'bill/calendar' } },
                    { key: '9-8', data: { label: 'Шаблондорду башкаруу(서식관리)', url: 'bill/calendar' } },
                    { key: '9-9', data: { label: 'Тилди башкаруу(언어관리)', url: 'bill/calendar' } },
                    { key: '9-10', data: { label: 'Меню башкаруу(메뉴관리)', url: 'bill/calendar' } },
                    { key: '9-11', data: { label: 'Укуктарга жараша меню башкаруу(권한별메뉴관리)', url: 'bill/calendar' } },
                    { key: '9-12', data: { label: 'Колдонуучуну бийлик тарабынан башкаруу(권한별사용자관리)', url: 'bill/calendar' } },
                ]
            },
        ];
    },

    getAuthMenuTreeNodesDataSample() {
        return [
            {
                key: '0',
                data: {
                    label: 'Мыйзам долбоорун сунуштоо',
                    url: 'bill/apply',
                    read: false,
                    cud: false,
                },
                children: [
                    { key: '0-0', data: { label: 'Маселени киргизүү ', url: 'bill/apply/dtl', read: false } },
                    { key: '0-1', data: { label: 'Маселени колдоо ', url: 'bill/agree' } },
                    { key: '0-2', data: { label: 'Маселени артка кайтаруу ', url: 'bill/revoke' } },
                    { key: '0-3', data: { label: 'Маселени артка кайтарууну колдоо ', url: 'bill/revoke/agree' } },
                ]
            },
            {
                key: '1',
                data: {
                    label: 'Маселени карап чыгуу ',
                    url: 'bill/audit'
                },
                children: [
                    { key: '1-0', data: { label: 'Бардык маселелер ', url: 'bill/all' } },
                    { key: '1-1', data: { label: 'Маселени башкаруу ', url: 'bill/manege' } },
                    { key: '1-2', data: { label: 'Юридикалык кароо', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'пикир кагазы', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Жооптуу комитет', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Байланыштуу комитет', url: 'bill/apply' } },
                    { key: '1-3', data: { label: 'Башкы жыйындын текшерүүсү', url: 'bill/apply' } },
                ]
            },
            {
                key: '2',
                data: {
                    label: 'Комитеттин жыйыны',
                    url: 'bill/cmt/meeting'
                },
                children: [
                    { key: '2-0', data: { label: 'Пландалган жыйындар', url: 'bill/meeting/expected' } },
                    { key: '2-1', data: { label: 'Жыйындын жыйынтыгы', url: 'bill/meeting/result' } },
                    { key: '2-2', data: { label: 'Жыйындын маалыматын көрүү', url: 'bill/meeting/read' } },
                ]
            },
            {
                key: '4',
                data: {
                    label: 'Электрондук бекитүү'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '4-0', data: { label: 'Долбоордук документтер', url: 'bill/calendar' } },
                    { key: '4-1', data: { label: 'Бекитүү кутучасы', url: 'bill/monitoring' } },
                    { key: '4-2', data: { label: 'Кабыл алуу кутучасы', url: 'bill/statistic' } },
                    { key: '4-2', data: { label: 'Архив папкасы', url: 'bill/statistic' } },
                ]
            },
            {
                key: '3',
                data: {
                    label: 'Мыйзам долбоорунун абалы'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '3-0', data: { label: 'күн тартиби', url: 'bill/calendar' } },
                    { key: '3-1', data: { label: 'Маселе мониторинги', url: 'bill/monitoring' } },
                    { key: '3-2', data: { label: 'статистика', url: 'bill/statistic' } },
                    { key: '3-3', data: { label: 'Жалпы жыйындын добуш берүү маалыматы', url: 'bill/apply' } },
                ]
            },
            {
                key: '5',
                data: {
                    label: 'документ башкаруу'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '5-0', data: { label: 'документ башкаруу', url: 'bill/calendar' } },
                ]
            },
            {
                key: '6',
                data: {
                    label: 'Маселени издөө'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '6-0', data: { label: 'Кененирээк издөө', url: 'bill/calendar' } },
                    { key: '6-1', data: { label: 'Жалпы издөө', url: 'bill/calendar' } },
                ]
            },
            {
                key: '7',
                data: {
                    label: 'Менин баракчам'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '7-0', data: { label: 'менин маалыматым', url: 'bill/calendar' } },
                    { key: '7-1', data: { label: 'Билдирүү башкаруу', url: 'bill/calendar' } },
                ]
            },
            {
                key: '8',
                data: {
                    label: 'эскертүү тактасы'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '8-0', data: { label: 'кулактандыруу', url: 'bill/calendar' } },
                    { key: '8-1', data: { label: 'маалымат бөлмөсү', url: 'bill/calendar' } },
                    { key: '8-2', data: { label: 'FAQ', url: 'bill/calendar' } },
                ]
            },
            {
                key: '9',
                data: {
                    label: 'Администратор'
                    , url: 'bill/curr'
                },
                children: [
                    { key: '9-0', data: { label: 'Маалымат тактасын башкаруу', url: 'bill/calendar' } },
                    { key: '9-1', data: { label: 'Колдонуучуну башкаруу', url: 'bill/calendar' } },
                    { key: '9-2', data: { label: 'Бөлүм башкаруу', url: 'bill/calendar' } },
                    { key: '9-3', data: { label: 'Туташуу тарыхы', url: 'bill/calendar' } },
                    { key: '9-4', data: { label: 'Негизги коддорду башкаруу', url: 'bill/calendar' } },
                    { key: '9-5', data: { label: 'Коддорду башкаруу', url: 'bill/calendar' } },
                    { key: '9-6', data: { label: 'Күн тартибин башкаруу', url: 'bill/calendar' } },
                    { key: '9-7', data: { label: 'SED маалыматтары', url: 'bill/calendar' } },
                    { key: '9-8', data: { label: 'Шаблондорду башкаруу', url: 'bill/calendar' } },
                    { key: '9-9', data: { label: 'Тилди башкаруу', url: 'bill/calendar' } },
                    { key: '9-10', data: { label: 'Меню башкаруу', url: 'bill/calendar' } },
                    { key: '9-11', data: { label: 'Укуктарга жараша меню башкаруу', url: 'bill/calendar' } },
                    { key: '9-12', data: { label: 'Колдонуучуну бийлик тарабынан башкаруу', url: 'bill/calendar' } },
                ]
            },
        ];
    },

    getDeptInUserNodesData() {
        return [
            {
                key: 0,
                data: {
                    label: 'экономикалык комитет (경제위원회)',
                    // userNm: 'баары(전체)'
                },
                children: [
                    { key: '0-0', data: { label: 'экономикалык комитет (경제위원회)', userNm: 'Исаева Джамиля Кубанычбековна' } },
                    { key: '0-1', data: { label: 'экономикалык комитет (경제위원회)', userNm: 'Нурланбек Шакиев Тургунбекович' } },
                    { key: '0-2', data: { label: 'экономикалык комитет (경제위원회)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                ]
            },
            {
                key: 1,
                data: {
                    label: 'Энергетика жана минералдык ресурстар комитети (에너지 및 광물 자원 위원회)',
                },
                children: [
                    { key: '1-0', data: { label: 'Энергетика жана минералдык ресурстар комитети (에너지 및 광물 자원 위원회)', userNm: 'Исаева Джамиля Кубанычбековна' } },
                    { key: '1-1', data: { label: 'Энергетика жана минералдык ресурстар комитети (에너지 및 광물 자원 위원회)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                    { key: '1-2', data: { label: 'Энергетика жана минералдык ресурстар комитети (에너지 및 광물 자원 위원회)', userNm: 'Нурланбек Шакиев Тургунбекович' } },
                    { key: '1-3', data: { label: 'Энергетика жана минералдык ресурстар комитети (에너지 및 광물 자원 위원회)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                ]
            },
            {
                key: 2,
                data: {
                    label: 'Системаны башкаруу бөлүмү(시스템관리부서)',
                },
                children: [
                    { key: '2-0', data: { label: 'Системаны башкаруу бөлүмү(시스템관리부서)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                    { key: '2-1', data: { label: 'Системаны башкаруу бөлүмү(시스템관리부서)', userNm: 'Нурланбек Шакиев Тургунбекович' } },
                    { key: '2-2', data: { label: 'Системаны башкаруу бөлүмү(시스템관리부서)', userNm: 'нг Гил-дон' } },
                ]
            },
            {
                key: 3,
                data: {
                    label: 'Юридикалык экспертиза бөлүмү(법률심사부서)',
                },
                children: [
                    { key: '3-0', data: { label: 'Юридикалык экспертиза бөлүмү(법률심사부서)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                    { key: '3-1', data: { label: 'Юридикалык экспертиза бөлүмү(법률심사부서)', userNm: 'Нурланбек Шакиев Тургунбекович' } },
                    { key: '3-2', data: { label: 'Юридикалык экспертиза бөлүмү(법률심사부서)', userNm: 'нг Гил-дон' } },
                ]
            },
            {
                key: 4,
                data: {
                    label: 'Жалпы бөлүм(일반부서)',
                },
                children: [
                    { key: '4-0', data: { label: 'Жалпы бөлүм(일반부서)', userNm: 'Министрлер Кабинетинин төрагасы' } },
                ]
            },
        ];
    },
    getSampleTreeNodesData() {
        return [
            {
                key: '0',
                label: 'I. Долбоорлорду башкаруу',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    {
                        key: '0-0',
                        label: '보고 및 업무',
                        data: 'Work Folder',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            {
                                key: '0-0-0', label: '보고(KOICA)', icon: 'pi pi-fw pi-folder', data: 'Expenses Document',
                                children: [
                                    { key: '0-0-0-1', label: '보고1', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                    { key: '0-0-0-2', label: '보고2', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                ]
                            },
                            {
                                key: '0-0-1', label: '사진', icon: 'pi pi-fw pi-folder', data: 'Expenses Document',
                                children: [
                                    { key: '0-0-1-1', label: '사진1', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                    { key: '0-0-1-2', label: '사진2', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                                ]
                            },
                            { key: '0-0-2', label: '수집자료', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                            { key: '0-0-3', label: '일일보고', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                        ]
                    },
                    { key: '0-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-3', label: '착수조사 계획', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-4', label: '품질 관리', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                    { key: '0-5', label: '홍보 영상 제작', icon: 'pi pi-fw pi-folder', data: 'Resume Document' },
                ]
            },
            {
                key: '1',
                label: 'VI. Потенциалды жогорулатуу',
                data: 'Events Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '1-0', label: '보고 및 업무', icon: 'pi pi-fw pi-folder', data: 'Meeting' },
                    { key: '1-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Product Launch' },
                    { key: '1-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Report Review' }
                ]
            },
            {
                key: '2',
                label: 'VII. Башка материалдар',
                data: 'Movies Folder',
                icon: 'pi pi-fw pi-folder',
                children: [
                    { key: '2-0', label: '보고 및 업무', icon: 'pi pi-fw pi-folder', data: 'Meeting' },
                    { key: '2-1', label: '보안 관리', icon: 'pi pi-fw pi-folder', data: 'Product Launch' },
                    { key: '2-2', label: '산출물 관리', icon: 'pi pi-fw pi-folder', data: 'Report Review' }
                ]
            }
        ];
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    },

    getTreeNodes() {
        return Promise.resolve(this.getTreeNodesData());
    },

    getSampleTreeNodes() {
        return Promise.resolve(this.getSampleTreeNodesData());
    },

    getDeptTreeNodes() {
        return Promise.resolve(this.getDeptTreeNodesData())
    },

    getMenuTreeNodes() {
        return Promise.resolve(this.getMenuTreeNodesData());
    },

    getAuthMenuTreeNodes() {
        return Promise.resolve(this.getAuthMenuTreeNodesData())
    },

    getAuthMenuTreeNodesSample() {
        return Promise.resolve(this.getAuthMenuTreeNodesDataSample())
    },

    getDeptInUserNodes() {
        return Promise.resolve(this.getDeptInUserNodesData())
    }
};
