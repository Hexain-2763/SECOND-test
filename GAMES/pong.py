import tkinter as tk
import random

WIDTH, HEIGHT = 800, 500
BALL_SIZE = 15
PAD_W, PAD_H = 10, 80
PADDLE_SPEED = 6
BALL_SPEED_X = 5
BALL_SPEED_Y = 5
WIN_SCORE = 7

class Pong:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Pong")
        self.root.resizable(False, False)
        self.canvas = tk.Canvas(self.root, width=WIDTH, height=HEIGHT, bg="black", highlightthickness=0)
        self.canvas.pack()

        self.ball = self.canvas.create_oval(0, 0, BALL_SIZE, BALL_SIZE, fill="white")
        self.p1 = self.canvas.create_rectangle(0, 0, PAD_W, PAD_H, fill="cyan")
        self.p2 = self.canvas.create_rectangle(0, 0, PAD_W, PAD_H, fill="magenta")

        self.score_text = self.canvas.create_text(WIDTH // 2, 40, text="0 : 0", fill="white",
                                                    font=("Consolas", 36), anchor="center")
        self.center_line = self.canvas.create_line(WIDTH // 2, 0, WIDTH // 2, HEIGHT, fill="gray20", dash=(10, 10))

        self.pressed = set()
        self.canvas.bind_all("<KeyPress-w>", lambda e: self.pressed.add("w"))
        self.canvas.bind_all("<KeyPress-s>", lambda e: self.pressed.add("s"))
        self.canvas.bind_all("<KeyPress-Up>", lambda e: self.pressed.add("Up"))
        self.canvas.bind_all("<KeyPress-Down>", lambda e: self.pressed.add("Down"))
        self.canvas.bind_all("<KeyRelease-w>", lambda e: self.pressed.discard("w"))
        self.canvas.bind_all("<KeyRelease-s>", lambda e: self.pressed.discard("s"))
        self.canvas.bind_all("<KeyRelease-Up>", lambda e: self.pressed.discard("Up"))
        self.canvas.bind_all("<KeyRelease-Down>", lambda e: self.pressed.discard("Down"))
        self.score1 = 0
        self.score2 = 0
        self.bx = WIDTH // 2 - BALL_SIZE // 2
        self.by = HEIGHT // 2 - BALL_SIZE // 2
        self.bdx = BALL_SPEED_X * random.choice([-1, 1])
        self.bdy = BALL_SPEED_Y * random.choice([-1, 1])

        self.reset_positions()
        self.running = True
        self.paused = False

        self.canvas.focus_set()
        self.game_loop()

    def reset_positions(self):
        self.canvas.coords(self.p1, 30, HEIGHT // 2 - PAD_H // 2, 30 + PAD_W, HEIGHT // 2 + PAD_H // 2)
        self.canvas.coords(self.p2, WIDTH - 30 - PAD_W, HEIGHT // 2 - PAD_H // 2, WIDTH - 30, HEIGHT // 2 + PAD_H // 2)
        self.bx = WIDTH // 2 - BALL_SIZE // 2
        self.by = HEIGHT // 2 - BALL_SIZE // 2
        self.canvas.coords(self.ball, self.bx, self.by, self.bx + BALL_SIZE, self.by + BALL_SIZE)

    def serve(self):
        self.bdx = BALL_SPEED_X * random.choice([-1, 1])
        self.bdy = BALL_SPEED_Y * random.choice([-1, 1])

    def move_paddles(self):
        p1_dir = -1 if "w" in self.pressed else (1 if "s" in self.pressed else 0)
        p2_dir = -1 if "Up" in self.pressed else (1 if "Down" in self.pressed else 0)
        for p, d in [(self.p1, p1_dir), (self.p2, p2_dir)]:
            x1, y1, x2, y2 = self.canvas.coords(p)
            ny = y1 + d * PADDLE_SPEED
            if ny < 0:
                ny = 0
            if ny + PAD_H > HEIGHT:
                ny = HEIGHT - PAD_H
            self.canvas.coords(p, x1, ny, x2, ny + PAD_H)

    def move_ball(self):
        self.bx += self.bdx
        self.by += self.bdy

        if self.by <= 0 or self.by + BALL_SIZE >= HEIGHT:
            self.bdy = -self.bdy
            self.by = max(0, min(self.by, HEIGHT - BALL_SIZE))

        p1_coords = self.canvas.coords(self.p1)
        p2_coords = self.canvas.coords(self.p2)

        ball_box = (self.bx, self.by, self.bx + BALL_SIZE, self.by + BALL_SIZE)

        for pad_coords in [p1_coords, p2_coords]:
            if self.ball_hits_paddle(ball_box, pad_coords):
                self.bdx = -self.bdx
                overlap = (ball_box[1] + ball_box[3]) / 2 - (pad_coords[1] + pad_coords[3]) / 2
                self.bdy = overlap * 0.2
                if abs(self.bdy) < 2:
                    self.bdy = 2 if self.bdy >= 0 else -2
                break

        self.canvas.coords(self.ball, self.bx, self.by, self.bx + BALL_SIZE, self.by + BALL_SIZE)

    def ball_hits_paddle(self, ball, pad):
        return ball[2] > pad[0] and ball[0] < pad[2] and ball[3] > pad[1] and ball[1] < pad[3]

    def check_score(self):
        if self.bx < 0:
            self.score2 += 1
            return True
        elif self.bx > WIDTH:
            self.score1 += 1
            return True
        return False

    def draw_score(self):
        self.canvas.itemconfig(self.score_text, text=f"{self.score1} : {self.score2}")

    def game_over(self, winner):
        self.canvas.create_text(WIDTH // 2, HEIGHT // 2, text=f"Player {winner} Wins!",
                                fill="yellow", font=("Consolas", 40), anchor="center")
        self.canvas.create_text(WIDTH // 2, HEIGHT // 2 + 50, text="Press R to restart or Q to quit",
                                fill="gray", font=("Consolas", 16), anchor="center")
        self.canvas.bind_all("<KeyPress-r>", lambda e: self.restart())
        self.canvas.bind_all("<KeyPress-q>", lambda e: self.root.destroy())
        self.running = False

    def restart(self):
        self.canvas.delete("all")
        self.__init__()

    def game_loop(self):
        if not self.running:
            return
        self.move_paddles()
        self.move_ball()
        if self.check_score():
            self.draw_score()
            if self.score1 >= WIN_SCORE:
                self.game_over(1)
                return
            elif self.score2 >= WIN_SCORE:
                self.game_over(2)
                return
            self.reset_positions()
            self.serve()
        self.draw_score()
        self.root.after(16, self.game_loop)

if __name__ == "__main__":
    game = Pong()
    game.root.mainloop()
