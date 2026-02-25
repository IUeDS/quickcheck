import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

let nextId = 0;
type Variant = 'danger' | 'success' | 'warning' | 'info';

@Component({ 
  selector: 'qc-alert-message', 
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'] 
})
export class AlertMessageComponent implements OnInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLElement>;

  @Input() utilitiesService: UtilitiesService;
  @Input() id?: string;                 // optional override
  @Input() visible = false;            // toggles visual state
  @Input() variant: Variant = 'danger';
  @Input() focusOnShow = false;
  @Input() alertKey?: string;       // register with utilities service, esp. for queued errors on load

  // content managed by show()
  message: string | null = null;
  items: string[] | null = null;

  currentRole: 'alert' | 'status' | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.id) this.id = `app-alert-${Date.now().toString(36)}-${nextId++}`;
    if (this.alertKey) this.utilitiesService.registerAlert(this.alertKey, this);
  }

  ngOnDestroy() {
    if (this.alertKey) this.utilitiesService.unregisterAlert(this.alertKey);
  }

  get bsClass() {
    return {
      'alert-danger': this.variant === 'danger',
      'alert-success': this.variant === 'success',
      'alert-warning': this.variant === 'warning',
      'alert-info': this.variant === 'info',
    };
  }

  get ariaLive() {
    return this.variant === 'danger' ? 'assertive' : 'polite';
  }

  show(msg: string | null, items?: string[] | null, opts?: { variant?: Variant; focus?: boolean }) {
    this.variant = opts?.variant ?? this.variant;
    this.focusOnShow = !!opts?.focus;

    // 1) remove role & content so repeated identical messages will re-read
    this.currentRole = null;
    this.message = null;
    this.items = null;
    this.visible = true;         // remove sr-only
    this.cdr.detectChanges();

    // 2) set content then set role to trigger screen reader
    setTimeout(() => {
      this.message = msg;
      this.items = items ?? null;
      this.currentRole = this.variant === 'danger' ? 'alert' : 'status';
      this.cdr.detectChanges();

      if (this.focusOnShow) {
        try { this.host.nativeElement.focus(); } catch {}
      }
    }, 0);
  }

  clear() {
    this.currentRole = null;
    this.message = null;
    this.items = null;
    this.visible = false;
    this.cdr.detectChanges();
  }
}