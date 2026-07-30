import tkinter as tk
import random

WIDTH, HEIGHT = 1000, 650
BALL_SIZE = 15
PAD_W, PAD_H = 10, 80
PADDLE_SPEED = 6
BALL_SPEED_X = 5
BALL_SPEED_Y = 5
WIN_SCORE = 7

P1_COLOR = (135, 206, 235)  # sky blue
P2_COLOR = (255, 51, 51)    # red

class Pong:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Pong")
        self.root.resizable(False, False)
        self.canvas = tk.Canvas(self.root, width=WIDTH, height=HEIGHT, bg="black", highlightthickness=0)
        self.canvas.pack()

        self.draw_gradient()

        self.ball = self.canvas.create_oval(0, 0, BALL_SIZE, BALL_SIZE, fill="white")
        p1_hex = f"#{P1_COLOR[0]:02x}{P1_COLOR[1]:02x}{P1_COLOR[2]:02x}"
        p2_hex = f"#{P2_COLOR[0]:02x}{P2_COLOR[1]:02x}{P2_COLOR[2]:02x}"
        self.p1 = self._rounded_paddle(p1_hex)
        self.p2 = self._rounded_paddle(p2_hex)

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

    def draw_gradient(self):
        half = WIDTH // 2
        step = 4
        for x in range(0, half, step):
            factor = (1 - x / half) * 0.15
            r = int(P1_COLOR[0] * factor)
            g = int(P1_COLOR[1] * factor)
            b = int(P1_COLOR[2] * factor)
            color = f"#{r:02x}{g:02x}{b:02x}"
            self.canvas.create_rectangle(x, 0, x + step, HEIGHT, fill=color, outline="", tags="glow")
        for x in range(0, half, step):
            factor = (1 - x / half) * 0.15
            r = int(P2_COLOR[0] * factor)
            g = int(P2_COLOR[1] * factor)
            b = int(P2_COLOR[2] * factor)
            color = f"#{r:02x}{g:02x}{b:02x}"
            self.canvas.create_rectangle(WIDTH - x - step, 0, WIDTH - x, HEIGHT, fill=color, outline="", tags="glow")
        self.canvas.tag_lower("glow")

    def _rounded_paddle(self, color):
        x1, y1, x2, y2 = 0, 0, PAD_W, PAD_H
        r = PAD_W // 2
        points = [
            x1+r, y1, x2-r, y1, x2, y1, x2, y1+r,
            x2, y2-r, x2, y2, x2-r, y2, x1+r, y2,
            x1, y2, x1, y2-r, x1, y1+r, x1, y1
        ]
        return self.canvas.create_polygon(points, smooth=True, fill=color, outline="")

    def _rounded_coords(self, x, y):
        x2, y2 = x + PAD_W, y + PAD_H
        r = PAD_W // 2
        return [
            x+r, y, x2-r, y, x2, y, x2, y+r,
            x2, y2-r, x2, y2, x2-r, y2, x+r, y2,
            x, y2, x, y2-r, x, y+r, x, y
        ]

    def reset_positions(self):
        self.p1x = 30
        self.p1y = HEIGHT // 2 - PAD_H // 2
        self.p2x = WIDTH - 30 - PAD_W
        self.p2y = HEIGHT // 2 - PAD_H // 2
        self.canvas.coords(self.p1, *self._rounded_coords(self.p1x, self.p1y))
        self.canvas.coords(self.p2, *self._rounded_coords(self.p2x, self.p2y))
        self.bx = WIDTH // 2 - BALL_SIZE // 2
        self.by = HEIGHT // 2 - BALL_SIZE // 2
        self.canvas.coords(self.ball, self.bx, self.by, self.bx + BALL_SIZE, self.by + BALL_SIZE)

    def serve(self):
        self.bdx = BALL_SPEED_X * random.choice([-1, 1])
        self.bdy = BALL_SPEED_Y * random.choice([-1, 1])

    def move_paddles(self):
        p1_dir = -1 if "w" in self.pressed else (1 if "s" in self.pressed else 0)
        p2_dir = -1 if "Up" in self.pressed else (1 if "Down" in self.pressed else 0)
        self.p1y = max(0, min(HEIGHT - PAD_H, self.p1y + p1_dir * PADDLE_SPEED))
        self.p2y = max(0, min(HEIGHT - PAD_H, self.p2y + p2_dir * PADDLE_SPEED))
        self.canvas.coords(self.p1, *self._rounded_coords(self.p1x, self.p1y))
        self.canvas.coords(self.p2, *self._rounded_coords(self.p2x, self.p2y))

    def move_ball(self):
        self.bx += self.bdx
        self.by += self.bdy

        if self.by <= 0 or self.by + BALL_SIZE >= HEIGHT:
            self.bdy = -self.bdy
            self.by = max(0, min(self.by, HEIGHT - BALL_SIZE))

        ball_box = (self.bx, self.by, self.bx + BALL_SIZE, self.by + BALL_SIZE)
        p1_box = (self.p1x, self.p1y, self.p1x + PAD_W, self.p1y + PAD_H)
        p2_box = (self.p2x, self.p2y, self.p2x + PAD_W, self.p2y + PAD_H)

        for pad_box in [p1_box, p2_box]:
            if self.ball_hits_paddle(ball_box, pad_box):
                self.bdx = -self.bdx
                overlap = (ball_box[1] + ball_box[3]) / 2 - (pad_box[1] + pad_box[3]) / 2
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
