import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filterTreePipe',pure:false})
export class FilterTreePipe implements PipeTransform {
  transform(nodes: any, filter: string): any {
    if (filter !== undefined && filter !== '') {
      return filterNodeArray(nodes, filter);
    } else {
      return nodes;
    }
  }
}

function filterNodeArray(nodes, filter) {
  if (nodes && nodes.length > 0) {
    //返回Array node
    return nodes.filter(node => filterNodeRecursively(node, filter));
  }
}

function filterNodeRecursively(node, filter) {
  if (node.children) {
    return filterNodeArray(node.children, filter);
  } else {
    return matches(node, filter);
  }
}

function matches(node, filter) {
  return node.label.startsWith(filter);
}
