import { NzTreeNodeOptions } from "ng-zorro-antd/tree";

export class TreeHelper {
  static searchNodeInTree(nodes: any[], matchingKey: string): NzTreeNodeOptions | null {
    if (!matchingKey) {
      return null;
    }
    let i;
    let result = null;
    for (i = 0; result === null && i < nodes.length; i++) {
      result = TreeHelper.searchTree(nodes[i], matchingKey);
      if (result) {
        return result;
      }
    }
    return null;
  }

  // get selected tree item by ID
  static searchTree(element: NzTreeNodeOptions, matchingKey: string = ''): NzTreeNodeOptions | null {
    if (element.key === matchingKey) {
      return element;
    } else if (element.children) {
      return TreeHelper.searchNodeInTree(element.children, matchingKey);
    }
    return null;
  }

  static mapTreeResponse(data: any, isShowCount: boolean = true): any {
    return {
      ...data,
      title: isShowCount ? data.groupName + ` (${data.countPosts ? data.countPosts >= 100 ? '99+' : data.countPosts : 0})` : data.groupName,
      name: data.groupName,
      key: data.id + '',
      isLeaf: data.groupChild && data.groupChild > 0 ? false : true, // if group has children, show expand icon -> isLeaf = false
      status: data.isActive ? 1 : 0,
      children: [],
      categoryId: data.groupId,
      expanded: false,
      rulesContextMenu: {
        ruleEdit: ['ROLE_ARTICLE_GROUP_UPDATE'],
        ruleDelete: ['ROLE_ARTICLE_GROUP_DELETE'],
      },
    }
  }

  static parseDataModules(modules: any[], addRules = false) {
    const getChild = (c: any, key: string, parentId: any) => {
      const data = {
        ...c,
        title: c?.moduleName || c?.menuName,
        name: c?.moduleName || c?.menuName,
        key: (key ? key + '-' : '') + (c?.id || c?.moduleId),
        id: c?.id || c?.moduleId,
        isMenu: !!c?.id,
        isLeaf: !!c?.id,
        rulesContextMenu: addRules ? {
          ruleEdit: ['ROLE_MENU_UPDATE'],
          ruleDelete: ['ROLE_MENU_DELETE'],
        } : null,
        moduleId: c?.id ? null : c?.moduleId,
        parentId: parentId,
        children: []
      }
      data.children = c?.items?.map((ic: any) => getChild(ic, data.key, data?.id)) || []
      return data
    }
    return modules.map(m => getChild(m, '', null))
  }
}
