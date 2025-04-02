import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  displayText: string = '';
  showCursor: boolean = true;
  typingSpeed: number = 50; // Adjust speed of typing effect
  messageIndex: number = 0;
  messages: string[] = ["Welcome!", "Would you like to enter? (Y/N)"];
  videoStarted: boolean = false;
  showImage: boolean = true;
  userInteractionCompleted: boolean = false;

  ngOnInit() {
    this.startTypingEffect();
  }

  startTypingEffect() {
    let currentMessage = this.messages[this.messageIndex];
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < currentMessage.length) {
        this.displayText += currentMessage[charIndex];
        charIndex++;
        setTimeout(typeNextChar, this.typingSpeed);
      } else {
        if (this.messageIndex === 0) {
          // Pause for 1 sec before erasing
          setTimeout(() => this.startBackspaceEffect(), 1000);
        }
      }
    };

    typeNextChar();
  }

  startBackspaceEffect() {
    let removeChar = () => {
      if (this.displayText.length > 0) {
        this.displayText = this.displayText.slice(0, -1);
        setTimeout(removeChar, this.typingSpeed / 2);
      } else {
        this.messageIndex = 1; // Move to the next message
        setTimeout(() => this.startTypingEffect(), 500); // Start typing next message
      }
    };

    removeChar();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.userInteractionCompleted) return; // Prevent multiple interactions

    if (event.key.toLowerCase() === 'y' || event.key.toLowerCase() === 'n') {
      this.userInteractionCompleted = true;
      if (event.key.toLowerCase() === 'y') {
        this.startVideo();
      } else {
        this.displayText = ""; // Clear previous text
        this.startTypingEffectWithNewMessage("I'm taking you in anyway...:)");
        setTimeout(() => this.startVideo(), 2500);
      }
    }
  }

  startTypingEffectWithNewMessage(newMessage: string) {
    this.displayText = "";
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
    const videoElement = document.querySelector('.hidden-video') as HTMLVideoElement;
    videoElement?.play();
    videoElement?.addEventListener('playing', () => {
      this.showImage = false; // Hide image only when the video starts playing
    });
    this.videoStarted = true;
  }
}