import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

export interface ArtPiece {
  id: number;
  num: string;
  title: string;
  fileName: string;
  imagePath: string;
  thumbPath: string;
  aspect: 'portrait' | 'square' | 'landscape';
  category: string;
}

// Build pieces from file list — title derived from original filename
function buildPieces(): ArtPiece[] {
  const files: [string, string][] = [
    ['1-fish.webp', '1 Fish'],
    ['2-wisp.webp', '2 Wisp'],
    ['3-bulky.webp', '3 Bulky'],
    ['rubendone.webp', 'Rubendone'],
    ['shackles-hands-final.webp', 'Shackles'],
    ['starfire.webp', 'Starfire'],
    ['thunderdogcon.webp', 'Thunderdog'],
    ['torttown.webp', 'Tort Town'],
    ['yali-asset.webp', 'Yali'],
    ['adityakarikalan.webp', 'Aditya Karikalan'],
    ['ape.webp', 'Ape'],
    ['bat1.webp', 'Bat'],
    ['batman-fanart.webp', 'Batman Fanart'],
    ['boquete.webp', 'Boquete'],
    ['casey-stern.webp', 'Casey Stern'],
    ['crabby.webp', 'Crabby'],
    ['daemon.webp', 'Daemon'],
    ['eagle.webp', 'Eagle'],
    ['empty.webp', 'Empty'],
    ['entity1.webp', 'Entity I'],
    ['entity2.webp', 'Entity II'],
    ['fire-deer8.webp', 'Fire Deer'],
    ['flames.webp', 'Flames'],
    ['forget.webp', 'Forget'],
    ['i-can-too.webp', 'I Can Too'],
    ['ironsymbiote.webp', 'Iron Symbiote'],
    ['kali.webp', 'Kali'],
    ['kalialt.webp', 'Kali Alt'],
    ['kang1.webp', 'Kang I'],
    ['kang2.webp', 'Kang II'],
    ['lady-drowned-don-finish-touch.webp', 'Lady Drowned'],
    ['manson-with-bg.webp', 'Manson'],
    ['match.webp', 'Match'],
    ['mmendook.webp', 'Mmendook'],
    ['moonmanbackupfin.webp', 'Moon Man'],
    ['nest.webp', 'Nest'],
    ['owlkenningscolort.webp', 'Owl Kennings'],
    ['pigeon-omen-fin-no-light.webp', 'Pigeon Omen'],
    ['pigeonfin.webp', 'Pigeon'],
    ['poochitaref.webp', 'Poochita'],
    ['practice1.webp', 'Practice I'],
    ['practice2.webp', 'Practice II'],
    ['practice3.webp', 'Practice III'],
    ['practice4.webp', 'Practice IV'],
    ['pricess-grim-rec-fin.webp', 'Princess Grim'],
    ['queen-monarchbackup8.webp', 'Queen Monarch'],
    ['radish-head.webp', 'Radish Head'],
    ['raintitanfinsun-wallpop.webp', 'Rain Titan'],
    ['riderlogo.webp', 'Rider Logo'],
    ['ruins-v2.4.2.webp', 'Ruins'],
    ['sad-girl.webp', 'Sad Girl'],
    ['sailormoon-recovered.webp', 'Sailor Moon'],
    ['scallop.webp', 'Scallop'],
    ['shiva.webp', 'Shiva'],
    ['skulltshirtprint.webp', 'Skull Print'],
    ['spriner-finv2.webp', 'Spriner'],
    ['storm-bringer-white-qk-fin.webp', 'Storm Bringer'],
    ['swords-plane-done.webp', 'Swords Plane'],
    ['templevillagevarf-6.webp', 'Temple Village'],
    ['tent-crop-2.webp', 'Tent II'],
    ['tent-crop-3.webp', 'Tent III'],
    ['tent-crop-4.webp', 'Tent IV'],
    ['tent-crop-5.webp', 'Tent V'],
    ['tent-crop.webp', 'Tent'],
    ['thunder-fin.webp', 'Thunder'],
    ['tormentdone.webp', 'Torment'],
    ['tripv2.webp', 'Trip'],
    ['tsukuyo2-yoshiwara-onfire.webp', 'Tsukuyo Yoshiwara On Fire'],
    ['vishnu.webp', 'Vishnu'],
    ['waagsewhitebg.webp', 'Waagse'],
    ['waterwitch.webp', 'Water Witch'],
    ['winry.webp', 'Winry'],
  ];

  const aspects: ('portrait' | 'square' | 'landscape')[] = [
    'landscape', 'portrait', 'square', 'landscape', 'portrait', 'square',
    'square', 'landscape', 'landscape', 'portrait', 'square', 'landscape',
    'portrait', 'square', 'portrait', 'square', 'landscape', 'landscape',
    'portrait', 'landscape', 'square', 'portrait', 'landscape', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'square', 'portrait', 'landscape', 'square', 'portrait',
    'landscape', 'portrait',
  ];

  const categories: string[] = [
    'Creature',     // 1 Fish
    'Concept',      // 2 Wisp
    'Character',    // 3 Bulky
    'Character',    // Rubendone
    'Concept',      // Shackles
    'Fanart',       // Starfire
    'Creature',     // Thunderdog
    'Environment',  // Tort Town
    'Mythology',    // Yali
    'Mythology',    // Aditya Karikalan
    'Creature',     // Ape
    'Creature',     // Bat
    'Fanart',       // Batman Fanart
    'Environment',  // Boquete
    'Character',    // Casey Stern
    'Creature',     // Crabby
    'Character',    // Daemon
    'Creature',     // Eagle
    'Concept',      // Empty
    'Character',    // Entity I
    'Character',    // Entity II
    'Creature',     // Fire Deer
    'Concept',      // Flames
    'Concept',      // Forget
    'Concept',      // I Can Too
    'Fanart',       // Iron Symbiote
    'Mythology',    // Kali
    'Mythology',    // Kali Alt
    'Fanart',       // Kang I
    'Fanart',       // Kang II
    'Character',    // Lady Drowned
    'Character',    // Manson
    'Concept',      // Match
    'Character',    // Mmendook
    'Character',    // Moon Man
    'Environment',  // Nest
    'Creature',     // Owl Kennings
    'Creature',     // Pigeon Omen
    'Creature',     // Pigeon
    'Character',    // Poochita
    'Study',        // Practice I
    'Study',        // Practice II
    'Study',        // Practice III
    'Study',        // Practice IV
    'Character',    // Princess Grim
    'Character',    // Queen Monarch
    'Character',    // Radish Head
    'Character',    // Rain Titan
    'Design',       // Rider Logo
    'Environment',  // Ruins
    'Character',    // Sad Girl
    'Fanart',       // Sailor Moon
    'Creature',     // Scallop
    'Mythology',    // Shiva
    'Design',       // Skull Print
    'Character',    // Spriner
    'Character',    // Storm Bringer
    'Environment',  // Swords Plane
    'Environment',  // Temple Village
    'Environment',  // Tent II
    'Environment',  // Tent III
    'Environment',  // Tent IV
    'Environment',  // Tent V
    'Environment',  // Tent
    'Character',    // Thunder
    'Concept',      // Torment
    'Concept',      // Trip
    'Fanart',       // Tsukuyo Yoshiwara On Fire
    'Mythology',    // Vishnu
    'Character',    // Waagse
    'Character',    // Water Witch
    'Fanart',       // Winry
  ];

  return files.map(([fileName, title], i) => {
    const thumbName = fileName.replace(/\.\w+$/, '.webp');
    return {
      id: i + 1,
      num: String(i + 1).padStart(3, '0'),
      title,
      fileName,
      imagePath: `assets/digital-art/${fileName}`,
      thumbPath: `assets/digital-art/thumbs/${thumbName}`,
      aspect: aspects[i % aspects.length],
      category: categories[i],
    };
  });
}

@Component({
  selector: 'app-digital-art',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, FooterComponent],
  templateUrl: './digital-art.component.html',
  styleUrls: ['./digital-art.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalArtComponent implements OnInit {
  pieces: ArtPiece[] = buildPieces();
  filteredPieces: ArtPiece[] = [];
  featuredPiece: ArtPiece = this.pieces.find(p => p.fileName === 'vishnu.webp')!;

  searchQuery = '';
  selectedPiece: ArtPiece | null = null;
  lightboxIndex = 0;

  ngOnInit() {
    this.filteredPieces = [...this.pieces];
  }

  filterPieces(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredPieces = [...this.pieces];
      return;
    }
    this.filteredPieces = this.pieces.filter((p) =>
      p.title.toLowerCase().includes(q)
    );
  }

  openLightbox(piece: ArtPiece): void {
    this.selectedPiece = piece;
    this.lightboxIndex = this.filteredPieces.findIndex(
      (p) => p.id === piece.id
    );
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.selectedPiece = null;
    document.body.style.overflow = '';
  }

  navigateLightbox(dir: number): void {
    if (!this.filteredPieces.length) return;
    this.lightboxIndex =
      (this.lightboxIndex + dir + this.filteredPieces.length) %
      this.filteredPieces.length;
    this.selectedPiece = this.filteredPieces[this.lightboxIndex];
  }

  onImageAreaClick(event: MouseEvent): void {
    event.stopPropagation();
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (event.clientX < rect.left + rect.width / 2) {
      this.navigateLightbox(-1);
    } else {
      this.navigateLightbox(1);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.selectedPiece) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.navigateLightbox(1);
    if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
  }
}
