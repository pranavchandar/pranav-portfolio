import { Component, ElementRef, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  @ViewChild('introVideo') introVideo?: ElementRef<HTMLVideoElement>;

  displayText = '';
  showCursor = true;
  typingSpeed = 50;
  messageIndex = 0;
  messages: string[] = ['Welcome!', 'Would you like to enter? (Y/N)'];
  videoStarted = false;
  userInteractionCompleted = false;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startTypingEffect();
    }
  }

  startTypingEffect() {
    const currentMessage = this.messages[this.messageIndex];
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < currentMessage.length) {
        this.displayText += currentMessage[charIndex];
        charIndex++;
        setTimeout(typeNextChar, this.typingSpeed);
      } else if (this.messageIndex === 0) {
        setTimeout(() => this.startBackspaceEffect(), 1000);
      }
    };

    typeNextChar();
  }

  startBackspaceEffect() {
    const removeChar = () => {
      if (this.displayText.length > 0) {
        this.displayText = this.displayText.slice(0, -1);
        setTimeout(removeChar, this.typingSpeed / 2);
      } else {
        this.messageIndex = 1;
        setTimeout(() => this.startTypingEffect(), 500);
      }
    };

    removeChar();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.userInteractionCompleted) return;

    const key = event.key.toLowerCase();
    if (key === 'y' || key === 'n') {
      this.userInteractionCompleted = true;
      if (key === 'y') {
        this.startVideo();
      } else {
        this.displayText = '';
        this.startTypingEffectWithNewMessage("I'm taking you in anyway... :)");
        setTimeout(() => this.startVideo(), 2500);
      }
    }
  }

  startTypingEffectWithNewMessage(newMessage: string) {
    this.displayText = '';
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < newMessage.length) {
        this.displayText += newMessage[charIndex];
        charIndex++;
        setTimeout(typeNextChar, this.typingSpeed);
      }
    };

    typeNextChar();
  }

  startVideo() {
    this.videoStarted = true;
    if (!this.isBrowser) return;
    setTimeout(() => {
      this.introVideo?.nativeElement.play().catch(() => {});
    }, 0);
  }
}
