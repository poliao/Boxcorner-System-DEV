export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'page',
    title: 'Pages',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Doc',
        title: 'เอกสาร',
        type: 'collapse',
        icon: 'ti ti-license',
        children: [
          {
            id: 'docsystem',
            title: 'Doc System',
            type: 'item',
            url: '/Dcsm01',
            breadcrumbs: false
          },
          {
            id: 'material-inventory',
            title: 'พัสดุและคลังกระดาษ',
            type: 'item',
            url: '/MaterialInventory',
            breadcrumbs: false
          }
        ]
      }
    ]
  },
  {
    id: 'stock-management',
    title: 'ระบบสต็อก (Stock)',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dcsm37',
        title: 'จัดการวัสดุ (DCSM37)',
        type: 'item',
        url: '/Dcsm37',
        icon: 'ti ti-package',
        breadcrumbs: false
      },
      {
        id: 'dcsm38',
        title: 'การแปลงหน่วย (DCSM38)',
        type: 'item',
        url: '/Dcsm38',
        icon: 'ti ti-arrows-exchange',
        breadcrumbs: false
      },
      {
        id: 'dcsm39',
        title: 'ผู้จำหน่าย/ยี่ห้อ (DCSM39)',
        type: 'item',
        url: '/Dcsm39',
        icon: 'ti ti-building-store',
        breadcrumbs: false
      },
      {
        id: 'dcsm40',
        title: 'รับวัตถุดิบ (DCSM40)',
        type: 'item',
        url: '/Dcsm40',
        icon: 'ti ti-file-import',
        breadcrumbs: false
      },
      {
        id: 'dcsm41',
        title: 'รายงานคงคลัง (DCSM41)',
        type: 'item',
        url: '/Dcsm41',
        icon: 'ti ti-clipboard-list',
        breadcrumbs: false
      }
    ]
  },
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'ti ti-typography'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'ti ti-brush'
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://tabler-icons.io/',
  //       icon: 'ti ti-plant-2',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'ti ti-brand-chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'ti ti-vocabulary',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];
