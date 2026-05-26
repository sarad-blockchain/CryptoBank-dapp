import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';

@Pipe({ name: 'ether', standalone: true })
export class EtherPipe implements PipeTransform {
  transform(value: bigint | string | null, decimals = 4): string {
    if (value === null || value === undefined) return '0.0000 ETH';
    try {
      const formatted = ethers.formatEther(value.toString());
      const num = parseFloat(formatted);
      return `${num.toFixed(decimals)} ETH`;
    } catch {
      return '0.0000 ETH';
    }
  }
}
