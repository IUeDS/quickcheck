import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
//see Alex Chuev's answer for source: https://stackoverflow.com/questions/35461203/angular-2-how-to-apply-orderby

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform = orderBy;
}
