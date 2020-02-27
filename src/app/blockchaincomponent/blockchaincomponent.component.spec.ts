import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchaincomponentComponent } from './blockchaincomponent.component';

describe('BlockchaincomponentComponent', () => {
  let component: BlockchaincomponentComponent;
  let fixture: ComponentFixture<BlockchaincomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchaincomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchaincomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
