import {TreeNode} from "primeng/primeng";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';

export function carsReducer(state: TreeNode[] = [], action: Action) {
  switch (action.type) {
    case 'GET_CARS':
      return [...state, ...action.payload];
    case 'TOGGLE_COMBINATION':
      const checkedField = action.payload.field + '_check';

      if (action.payload.node.level === 0) {
        state.map(data => {
          if (data.data.name === action.payload.node.name) {
            data.children = data.children.map(subdata => {
              subdata.data[checkedField] = action.payload.status;
              subdata.children = subdata.children.map(ssubdata => {
                ssubdata.data[checkedField] = action.payload.status;
                return ssubdata;
              });
              return subdata;
            });
          }
          return data;
        })
      } else if (action.payload.node.level === 1) {
        state.map(data => {
          let count = 0;
          data.children = data.children.map(subdata => {
            if (subdata.data.name === action.payload.node.name) {
              count++;
              if (!action.payload.status) {
                data.data[checkedField] = action.payload.status;
              }
              subdata.children = subdata.children.map(ssubdata => {
                ssubdata.data[checkedField] = action.payload.status;
                return ssubdata;
              });
            } else {
              if (subdata.data[checkedField]) {
                count++;
              }
            }

            if (data.children.length === count && _.findIndex(data.children, (d) => {
                return d.data.name === action.payload.node.name;
              }) !== -1) {data.data[checkedField] = action.payload.status;}

            return subdata;
          });

          return data;
        });
      }

    // if (action.payload.node.level === 0) {
    //   return state.map(data => {
    //     if (data.data.name === action.payload.node.name) {
    //       data.data[checkedField] = action.payload.status;
    //     }
    //     return data;
    //   });
    // } else {
    //   return state.map(data => {
    //     if (data.children) {
    //       data.children = data.children.map(subData => {
    //         if (subData.data.name === action.payload.node.name) {
    //           subData.data[checkedField] = action.payload.status;
    //         }
    //         return subData;
    //       })
    //       return data;
    //     }
    //   });
    // }
    default:
      return state;
  }
}

export function carsFilterReducer(state = (cars: TreeNode[]) => cars, action: Action) {
  switch (action.type) {
    case 'CAR_SELECTED':
      return (cars: TreeNode[]) => filterSelectedItems(cars, action.payload);
    default:
      return state;
  }
}

function filterSelectedItems(datas: any, selectedDatas: any): TreeNode[] {
  if(!_.isNil(selectedDatas) && selectedDatas.length > 0){
    selectedDatas = selectedDatas.filter(data => data.selected === true);
  } else {
    selectedDatas = null;
  }
  let selectedLabel = selectedDatas ? selectedDatas.map(data => data.label) : null;

  const filterItems: TreeNode[] = [];
  datas.forEach(data => {
    const newData = filterItemBySelected(data, selectedLabel);
    if (!_.isNil(newData)) {
      filterItems.push(newData);
    }
    if(filterItems && filterItems.length > 0){
      filterItems[0]['total_amount_count'] = 0;
    }
  });
  return filterItems;
}

function filterItemBySelected(item: TreeNode, selectedItem: any): TreeNode {
  const isMatch = selectedItem ? selectedItem.includes(item.data.name) : false;
  if (isMatch) {
    return item;
  } else {
    if (!_.isNil(item.children)) {
      const children: TreeNode[] = [];
      item.children.forEach(child => {
        const newChild = filterItemBySelected(child, selectedItem);
        if (!_.isNil(newChild)) {
          children.push(newChild);
        }
      });
      if (children.length > 0) {
        const newItem = Object.assign({}, item);
        newItem['children'] = children;
        return newItem;
      }
    }

  }
  return undefined;
}
