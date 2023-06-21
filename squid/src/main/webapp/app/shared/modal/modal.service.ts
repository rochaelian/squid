import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable()
export class ModalService {
  private rootViewContainer: ViewContainerRef | undefined;

  constructor(private factoryResolver: ComponentFactoryResolver) {
    this.factoryResolver = factoryResolver;
  }
  setRootViewContainerRef(viewContainerRef: any): void {
    this.rootViewContainer = viewContainerRef;
  }
  addDynamicComponent(modalTitle: string, modalText: string, modalImageUrl: string): void {
    const factory = this.factoryResolver.resolveComponentFactory(ModalComponent);
    const component = factory.create(this.rootViewContainer!.parentInjector);
    component.instance.modalTitle = modalTitle;
    component.instance.modalText = modalText;
    component.instance.modalImageUrl = modalImageUrl;
    // Subscribe to the closeModal event and destroy the component
    component.instance.closeModal.subscribe(() => this.removeDynamicComponent(component));

    this.rootViewContainer?.insert(component.hostView);
  }

  removeDynamicComponent(component: any): void {
    component.destroy();
  }
}
