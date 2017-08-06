import {TreeNode} from "primeng/primeng";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';

export function carTreeReducer(state:TreeNode[] = [], action:Action) {
  switch (action.type) {
    case 'GET_CARTREE':
      return [...state, ...action.payload];
    default:
      return state;
  }
}

export function carTreeFilterReducer(state = (cartrees:TreeNode[]) => cartrees, action:Action) {
  switch (action.type) {
    case 'SEARCH_KEYWORDS':
      return (cartrees:TreeNode[]) => updateFilterItems(cartrees, action.payload);
    case 'CARTREE_SELECTED':
      return (cartrees:TreeNode[]) => filterSelectedItems(cartrees);
    default:
      return state;
  }
}

function filterSelectedItems(cartrees:TreeNode[]):TreeNode[]{
  const filterItems:TreeNode[] = [];
  cartrees.forEach(cartree => {
    const newCarTree = filterItemBySelected(cartree);
    if(!_.isNil(newCarTree)){
      filterItems.push(newCarTree);
    }
  });
  return filterItems;
}

function filterItemBySelected(item:TreeNode):TreeNode{
  const isMatch = item['selected'] === true;
  if(isMatch){
    return item;
  } else {
    if(!_.isNil(item.children)){
      const children:TreeNode[] = [];
      item.children.forEach(child => {
        const newChild = filterItemBySelected(child);
        if(!_.isNil(newChild)){
          children.push(newChild);
        }
      });
      if(children.length > 0){
        const newItem = {};

        if(children.length === item.children.length){
          newItem['selected'] = true;
          newItem['partialSelected'] = false;
          //newItem['styleClass'] = 'ui-treenode-label ui-corner-all ui-state-highlight';
        } else {
          newItem['selected'] = false;
          newItem['partialSelected'] = true;
          //newItem['styleClass'] = 'ui-treenode-label ui-corner-all';
        }
        newItem['label'] = item.label;
        newItem['data'] = item.data;
        newItem['expanded'] = true;
        newItem['children'] = children;
        return newItem;
      }
    }

  }
  return undefined;
}

function updateFilterItems(cartrees:TreeNode[], keyword:string):TreeNode[] {
  if (keyword !== '') {
    const filterItems:TreeNode[] = [];
    const filterText = keyword.toLowerCase();
    cartrees.forEach(cartree => {
      const newCarTree = filterItem(cartree, keyword);
      if (!_.isNil(newCarTree)) {
        filterItems.push(newCarTree);
      }
    });
    return filterItems;
  } else {
    return cartrees;
  }
}

function filterItem(item:TreeNode, keyword:string):TreeNode {
  const isMatch = _.includes(item.label.toLowerCase(), keyword);
  if (isMatch) {
    return item;
  } else {
    if (!_.isNil(item.children)) {
      const children:TreeNode[] = [];
      item.children.forEach(child => {
        const newChild = filterItem(child, keyword);
        if (!_.isNil(newChild)) {
          children.push(newChild);
        }
      });
      if (children.length > 0) {
        const newItem = {};
        newItem['label'] = item.label;
        newItem['data'] = item.data;
        newItem['expanded'] = true;
        newItem['selected'] = false;
        newItem['children'] = children;
        return newItem;
      }
    }
  }

  return undefined;
}
