import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalTitle: string | undefined;
  @Input() modalText: string | undefined;
  @Input() modalImageUrl: string | undefined;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  close(event: any): void {
    this.closeModal.emit(event);
  }
}
