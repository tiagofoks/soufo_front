import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative'
  },
  template: `
    <button
      type="button"
      (click)="toggleUserMenu()"
      [attr.aria-expanded]="userMenuOpen()"
      aria-haspopup="true"
      aria-label="Menu do usuário"
      class="flex items-center justify-center w-12 h-12 rounded-full border border-slate-700 bg-slate-900/50 hover:border-cyan-500 transition-all shadow-lg overflow-hidden"
    >
      <span class="text-cyan-400 font-bold text-sm">{{ initials() }}</span>
    </button>

    @if (userMenuOpen()) {
      <div
        role="menu"
        class="absolute top-14 right-0 w-52 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 py-3 z-50"
      >
        <p class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 truncate">
          {{ userName() }}
        </p>

        <button
          type="button"
          role="menuitem"
          (click)="goToAccount()"
          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all"
        >
          Minha Conta
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all"
        >
          Eventos
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all"
        >
          Pontos
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all"
        >
          Projetos
        </button>

        <hr class="my-2 border-slate-800" />

        <button
          type="button"
          role="menuitem"
          (click)="logout()"
          class="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          Sair
        </button>
      </div>
    }
  `
})
export class UserMenuComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly userMenuOpen = signal(false);
  readonly initials = computed(() => this.userService.getInitials());
  readonly userName = computed(() => this.userService.getUserName());

  toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  goToAccount(): void {
    this.userMenuOpen.set(false);
    void this.router.navigate(['/account']);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.userService.logout();
    void this.router.navigate(['/login']);
  }
}
