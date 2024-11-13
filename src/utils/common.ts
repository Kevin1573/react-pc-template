import { cloneDeep } from "lodash";

// 格式化金额
export function formatNum(num: number | string) {
  const a = parseFloat(num.toString());
  return a.toLocaleString("zh-CN", { style: "currency", currency: "CNY" });
}

// 查找路由父节点
export function searchRoute(path: string, routes: any = []): any {
  for (const item of routes) {
    if (item.key === path) return item;
    if (item.children) {
      const route = searchRoute(path, item.children);
      if (route) return route;
    }
  }
  return null;
}

// 查找父节点没有就返回当前节点
export function findParentNode(key: any, menus: any) {
  for (const item of menus) {
    if (item.children) {
      // 检查当前节点的子节点中是否有目标键值
      const childMatch = item.children.find((child: any) => child.key === key);
      if (childMatch) {
        return item; // 返回当前节点，即父节点
      } else {
        // 递归搜索当前节点的子节点
        const parent = findParentNode(key, item.children);
        if (parent) {
          return item; // 返回当前节点，即父节点
        }
      }
    } else if (item.key === key) {
      return item;
    }
  }
  return null; // 如果没有找到匹配项，返回 null
}

/**
 * 传入的参数类型 ->  返回值
 * 0						  ->  "Number"
 * ""						  ->  "String"
 * []             ->  "Array"
 * {}             ->  "Object"
 * function(){}   ->  "Function"
 * null           ->  "Null"
 * undefined      ->  "Undefined"
 * true / false   ->  "Boolean"
 * new Date()     ->  "Date"
 * new Error()    ->  "Error"
 * new RegExp()   ->  "RegExp"
 */
export function whoami(val: any) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

// 格式化错误信息
export function formatErrMsg(err: any) {
  return whoami(err) === "String" ? err : JSON.stringify(err);
}

// 删除对象中的空值
export function deleteEmptyProperty(data: AnyObjectType) {
  const cloneData = JSON.parse(JSON.stringify(data));
  Object.keys(data).forEach(key => {
    if (whoami(data[key]) === "String") cloneData[key] = cloneData[key].trim();
    if (data[key] === null || data[key] === undefined || data[key] === "") delete cloneData[key];
  });
  return cloneData;
}

/**
 * 构造树形结构数据
 * @param {*} data 数据源
 * @param {*} orderNum 排序字段 默认 'order_num'
 * @param {*} parentId 父节点字段 默认 'parent'
 * @param {*} rootId 根Id 默认从 data 中获取最小的 parent 值
 */
export function constructTree(
  data: AnyArrayType,
  orderNum: string = "order_num",
  parentId: string = "parent",
  rootId?: number
) {
  // 确定根节点的id值
  rootId = rootId || Math.min(...data.map(item => item[parentId]));
  // 对源数据深度克隆
  const cloneData = cloneDeep(data);
  // 循环所有项
  const treeData = cloneData.filter((father: any) => {
    // 构造路由树时，如果存在重定向且为 noRedirect，则删除重定向属性
    // if (father.redirect && father.redirect === 'noRedirect') delete father.redirect
    // 返回每一项的子级数组
    const branchArr = cloneData.filter((child: any) => {
      return child[parentId] === father.id;
    });
    // 如果存在子级，则给它们排序并连接到父级的 children 属性上
    if (branchArr.length > 0) {
      branchArr.sort((a: AnyObjectType, b: AnyObjectType) => a[orderNum] - b[orderNum]);
      father.children = branchArr;
    }
    // 返回树形结构数据的第一层
    return !father[parentId] || father[parentId] === rootId;
  });
  // 循环结束后，排序并返回树形结构数据
  treeData.sort((a: AnyObjectType, b: AnyObjectType) => a[orderNum] - b[orderNum]);
  return treeData.length > 0 ? treeData : data;
}
