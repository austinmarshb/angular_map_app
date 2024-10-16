import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { WorldBankApiService } from '../world-bank-api.service';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements AfterViewInit {
  @ViewChild('svgMap', { static: true }) svgMap!: ElementRef;
  countryData: any = null;
  isTableVisible: boolean = false;
  tablePosition = { x: 0, y: 0 };

  constructor(private renderer: Renderer2, private worldBankApiService: WorldBankApiService) {}

  ngAfterViewInit() {
    const svgElement = this.svgMap.nativeElement;
    const paths = svgElement.querySelectorAll('path');

    paths.forEach((path: any) => {
      this.renderer.listen(path, 'click', (event: MouseEvent) => {
        const countryCode = path.id;
        this.fetchCountryData(countryCode, event);
      });
    });
  }

  fetchCountryData(countryCode: string, event: MouseEvent) {
    this.tablePosition.x = event.clientX;
    this.tablePosition.y = event.clientY;

    this.worldBankApiService.getCountryData(countryCode).subscribe((data: any) => {
      if (data && data[1] && data[1][0]) {
        this.countryData = {
          name: data[1][0].name,
          capital: data[1][0].capitalCity,
          region: data[1][0].region.value,
          incomeLevel: data[1][0].incomeLevel.value,
          latitude: data[1][0].latitude || 'N/A',
          longitude: data[1][0].longitude || 'N/A'
        };
        this.isTableVisible = true;
      } else {
        console.error('No data found for country code:', countryCode);
        this.countryData = null;
        this.isTableVisible = false;
      }
    }, error => {
      console.error('Error fetching country data:', error);
      this.countryData = null;
      this.isTableVisible = false;
    });
  }
}
