declare type PageRouteMeta = {
  label: string;
  icon: string | null;
  isRouter: boolean;
};

declare type PageRouteItem = {
  id: string | number;
  parent: string | number | null;
  order_num: number;
  path: string | null;
  element: string | null;
  meta: PageRouteMeta;
  type?: string
};
