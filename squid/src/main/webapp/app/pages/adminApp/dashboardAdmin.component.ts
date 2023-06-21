import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';

import { UserService } from '../../entities/user/user.service';
import { OrderService } from '../../entities/order/service/order.service';
import { BusinessService } from '../../entities/business/service/business.service';
import { Business } from '../../entities/business/business.model';
import { SeoRecordService } from '../../entities/seo-record/service/seo-record.service';

@Component({
  selector: 'jhi-admin-dashboard',
  templateUrl: './dashboardAdmin.component.html',
  styleUrls: ['./dashboardAdmin.component.scss'],
})
export class DashboardAdminComponent implements OnInit {
  public canvasUsers!: any;
  public canvasCompletedOrders!: any;
  public canvasWaitingOrders!: any;
  public canvasInProcessOrders!: any;
  public ctxUsers!: any;
  public ctxWaitingOrders!: any;
  public ctxInProcessOrders!: any;
  public ctxCompletedOrders!: any;
  public chartColor!: any;
  public chartUsers!: any;
  public chartWaitingOrders!: any;
  public chartInProcessOrders!: any;
  public chartCompletedOrders!: any;
  public chartHours!: any;

  public ordersComission!: any;
  public seoRecordSumCost!: any;
  public highestBusiness!: Business;
  public popularBrands!: any;
  public completedOrders!: any;
  public waitingOrders!: any;
  public inProcessOrders!: any;
  public usersDistribution!: any;

  constructor(
    protected userService: UserService,
    protected seoRecordService: SeoRecordService,
    protected businessService: BusinessService,
    protected orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.chartColor = '#FFFFFF';

    this.canvasUsers = document.getElementById('chartUsers');
    this.ctxUsers = this.canvasUsers.getContext('2d');

    this.userService.queryUserDistribution().subscribe(res => {
      this.fillUsersGraph(res.body);
    });

    this.orderService.queryOrderSumComission().subscribe(res => {
      this.fillOrdersComission(res.body);
    });

    this.seoRecordService.querySeoRecordSumCost().subscribe(res => {
      this.seoRecordSumCost = res.body;
    });

    this.orderService.queryPopularVehicles().subscribe(res => {
      this.fillPopularVehicles(res.body);
    });

    this.orderService.queryOrderPercentageByStatus('Pagado').subscribe(res => {
      this.fillCompletedOrdersGraph(res.body);
    });

    this.orderService.queryOrderPercentageByStatus('En espera').subscribe(res => {
      this.fillWaitingOrdersGraph(res.body);
    });

    this.orderService.queryOrderPercentageByStatus('En proceso').subscribe(res => {
      this.fillInProcessOrdersGraph(res.body);
    });

    this.businessService.queryHighestBusiness().subscribe(res => {
      this.fillHighestBusiness(res.body);
    });

    const speedCanvas = document.getElementById('speedChart') as HTMLCanvasElement;

    const dataFirst = {
      data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],
      fill: false,
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const dataSecond = {
      data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const speedData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [dataFirst, dataSecond],
    };

    const chartOptions: Chart.ChartOptions = {
      legend: {
        display: false,
        position: 'top',
      },
    };

    const lineChart = new Chart(speedCanvas, {
      type: 'line',
      // hover: false,
      data: speedData,
      options: chartOptions,
    });
  }

  fillOrdersComission(data: any): void {
    this.ordersComission = data;
  }

  fillHighestBusiness(data: any): void {
    this.highestBusiness = data;
  }

  fillPopularVehicles(data: any): void {
    this.popularBrands = data;
  }

  fillCompletedOrdersGraph(data: any): void {
    this.completedOrders = data;
    this.canvasCompletedOrders = document.getElementById('chartOrders');
    this.ctxCompletedOrders = this.canvasCompletedOrders.getContext('2d');

    this.chartCompletedOrders = new Chart(this.ctxCompletedOrders, {
      type: 'pie',
      data: {
        labels: [1, 2],
        datasets: [
          {
            label: 'Emails',
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ['#4acccd', '#f4f3ef'],
            borderWidth: 0,
            data: [this.completedOrders, 100 - this.completedOrders],
          },
        ],
      },
      options: {
        elements: {},
        cutoutPercentage: 90,
        legend: {
          display: false,
        },

        tooltips: {
          enabled: false,
        },

        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)',
              },
            },
          ],

          xAxes: [
            {
              //barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }

  fillInProcessOrdersGraph(data: any): void {
    this.inProcessOrders = data;
    this.canvasInProcessOrders = document.getElementById('chartInProcessOrders');
    this.ctxInProcessOrders = this.canvasInProcessOrders.getContext('2d');

    this.chartInProcessOrders = new Chart(this.ctxInProcessOrders, {
      type: 'pie',
      data: {
        labels: [1, 2],
        datasets: [
          {
            label: 'Emails',
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ['#fcc468', '#f4f3ef'],
            borderWidth: 0,
            data: [this.inProcessOrders, 100 - this.inProcessOrders],
          },
        ],
      },
      options: {
        elements: {},
        cutoutPercentage: 90,
        legend: {
          display: false,
        },

        tooltips: {
          enabled: false,
        },

        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)',
              },
            },
          ],

          xAxes: [
            {
              //barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }

  fillWaitingOrdersGraph(data: any): void {
    this.waitingOrders = data;
    this.canvasWaitingOrders = document.getElementById('chartWaitingOrders');
    this.ctxWaitingOrders = this.canvasWaitingOrders.getContext('2d');

    this.chartWaitingOrders = new Chart(this.ctxWaitingOrders, {
      type: 'pie',
      data: {
        labels: [1, 2],
        datasets: [
          {
            label: 'Emails',
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ['#f17e5d', '#f4f3ef'],
            borderWidth: 0,
            data: [this.waitingOrders, 100 - this.waitingOrders],
          },
        ],
      },
      options: {
        elements: {},
        cutoutPercentage: 90,
        legend: {
          display: false,
        },

        tooltips: {
          enabled: false,
        },

        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)',
              },
            },
          ],

          xAxes: [
            {
              //barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }

  fillUsersGraph(data: any): void {
    this.usersDistribution = data;
    this.chartUsers = new Chart(this.ctxUsers, {
      type: 'pie',
      data: {
        labels: [1, 2, 3],
        datasets: [
          {
            label: 'Usuarios',
            pointRadius: 0,
            pointHoverRadius: 0,
            barPercentage: 1.6,
            backgroundColor: ['#4acccd', '#fcc468', '#ef8157'],
            borderWidth: 0,
            data: [data['ROLE_OPERATOR'], data['ROLE_BUSINESS_ADMIN'], data['ROLE_USER']],
          },
        ],
      },

      options: {
        legend: {
          display: false,
        },

        // pieceLabel: {
        //   render: 'percentage',
        //   fontColor: ['white'],
        //   precision: 2
        // },

        tooltips: {
          enabled: false,
          displayColors: false,
        },

        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)',
              },
            },
          ],

          xAxes: [
            {
              // barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }
}
