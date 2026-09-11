from .extensions import db
from .models import Category, Event

DEFAULT_CATEGORIES = [
    "Concerts",
    "Sports",
    "Theatre & Shows",
    "Festivals",
    "Comedy",
    "Family Events",
    "Other Events",
]

DEFAULT_EVENTS = [
    dict(
        id="evt-001", name="Super Bowl LXI", slug="super-bowl-lxi",
        description="The biggest night in football returns to Las Vegas.",
        long_description="The NFL's championship game returns for another unforgettable night. Expect a world-class halftime show, two of the league's best teams, and an atmosphere unlike anywhere else in sports. Tickets for this event move quickly and are typically limited — our team specializes in sourcing last-minute inventory across every price tier.",
        category="Sports",
        image="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&q=80&auto=format&fit=crop",
        date="2027-02-07", time="6:30 PM", venue="Allegiant Stadium", address="3333 Al Davis Way",
        city="Las Vegas, NV", country="USA", latitude=36.0909, longitude=-115.183, starting_price=None, tickets_available=0,
        status="request", featured=True,
    ),
    dict(
        id="evt-002", name="Beyoncé — Renaissance Live", slug="beyonce-renaissance-live",
        description="The Renaissance World Tour makes its Miami stop.",
        long_description="An immersive, career-spanning production featuring elaborate staging, a full live band, and one of the most talked-about setlists of the year. This is a high-demand stop on the tour — our team can source tickets across the floor, lower bowl, and upper level based on your budget.",
        category="Concerts",
        image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80&auto=format&fit=crop",
        date="2026-08-24", time="8:00 PM", venue="Hard Rock Stadium", address="347 Don Shula Dr",
        city="Miami, FL", country="USA", latitude=25.958, longitude=-80.2389, starting_price=185, tickets_available=46,
        status="on-sale", featured=True,
    ),
    dict(
        id="evt-003", name="Coachella Valley Music & Arts Festival", slug="coachella-2027",
        description="Weekend one of the desert's flagship music festival.",
        long_description="Three days of music across five stages, featuring a mix of headline acts, breakout artists, and art installations across the Empire Polo Club grounds. We can help you find single-day, weekend, and VIP packages, including camping add-ons.",
        category="Festivals",
        image="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format&fit=crop",
        date="2027-04-16", time="12:00 PM", venue="Empire Polo Club", address="81-800 Avenue 51",
        city="Indio, CA", country="USA", latitude=33.6803, longitude=-116.2375, starting_price=549, tickets_available=120,
        status="on-sale", featured=True,
    ),
    dict(
        id="evt-004", name="NBA Finals — Game 4", slug="nba-finals-game-4",
        description="Championship basketball in a win-or-go-home matchup.",
        long_description="A pivotal home game in this year's NBA Finals series. Arena capacity is limited and demand is high — our team tracks resale availability across every section so you don't miss the chance to be there.",
        category="Sports",
        image="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80&auto=format&fit=crop",
        date="2027-06-11", time="9:00 PM", venue="Chase Center", address="1 Warriors Way",
        city="San Francisco, CA", country="USA", latitude=37.768, longitude=-122.3877, starting_price=340, tickets_available=18,
        status="limited", featured=False,
    ),
    dict(
        id="evt-005", name="Hamilton", slug="hamilton-national-tour",
        description="The Tony Award-winning musical, on tour.",
        long_description="Lin-Manuel Miranda's genre-defying musical tells the story of America's founding through hip-hop, jazz, R&B, and Broadway. This touring production has drawn sold-out crowds in every city — we recommend requesting tickets early.",
        category="Theatre & Shows",
        image="https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80&auto=format&fit=crop",
        date="2026-11-02", time="7:30 PM", venue="Orpheum Theatre", address="842 S Broadway",
        city="Los Angeles, CA", country="USA", latitude=34.0455, longitude=-118.2551, starting_price=129, tickets_available=64,
        status="on-sale", featured=False,
    ),
    dict(
        id="evt-006", name="Kevin Hart: Acting My Age", slug="kevin-hart-acting-my-age",
        description="A brand-new stand-up hour from Kevin Hart.",
        long_description="Kevin Hart brings his latest hour of stand-up to an intimate arena setting. Expect a high-energy show with material spanning family life, fame, and everything in between.",
        category="Comedy",
        image="https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80&auto=format&fit=crop",
        date="2026-10-18", time="8:00 PM", venue="Madison Square Garden", address="4 Pennsylvania Plaza",
        city="New York, NY", country="USA", latitude=40.7505, longitude=-73.9934, starting_price=95, tickets_available=87,
        status="on-sale", featured=False,
    ),
    dict(
        id="evt-007", name="Cowboys vs. Eagles — Sunday Night Football", slug="cowboys-vs-eagles-snf",
        description="An NFC East rivalry game under the lights.",
        long_description="One of the NFL's fiercest rivalries returns for a Sunday night showdown. Seating is especially limited for divisional matchups like this one — our team works directly with trusted sources to help fans secure a seat.",
        category="Sports",
        image="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&q=80&auto=format&fit=crop",
        date="2027-01-17", time="8:20 PM", venue="AT&T Stadium", address="1 AT&T Way",
        city="Arlington, TX", country="USA", latitude=32.7473, longitude=-97.0945, starting_price=210, tickets_available=12,
        status="limited", featured=False,
    ),
    dict(
        id="evt-008", name="Cirque du Soleil: Nova", slug="cirque-du-soleil-nova",
        description="An acrobatic spectacle set inside an electric nightclub.",
        long_description="A high-energy resident production blending acrobatics, live DJ sets, and immersive visuals. A great option for groups and family outings alike, with seating options ranging from general admission to VIP booths.",
        category="Family Events",
        image="https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&q=80&auto=format&fit=crop",
        date="2026-09-27", time="7:00 PM", venue="Resorts World Theatre", address="3000 Las Vegas Blvd S",
        city="Las Vegas, NV", country="USA", latitude=36.136, longitude=-115.1639, starting_price=79, tickets_available=143,
        status="on-sale", featured=False,
    ),
    dict(
        id="evt-009", name="US Open — Men's Semifinal", slug="us-open-mens-semifinal",
        description="Championship-caliber tennis at Arthur Ashe Stadium.",
        long_description="A semifinal session at the US Open, featuring some of the top-ranked players in the world. Sessions typically include multiple matches across the day or evening slate.",
        category="Sports",
        image="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80&auto=format&fit=crop",
        date="2026-09-11", time="1:00 PM", venue="Arthur Ashe Stadium", address="Flushing Meadows-Corona Park",
        city="Queens, NY", country="USA", latitude=40.7498, longitude=-73.8456, starting_price=265, tickets_available=39,
        status="on-sale", featured=False,
    ),
    dict(
        id="evt-010", name="Sundance Film Festival — Opening Night", slug="sundance-opening-night",
        description="The red-carpet kickoff to Sundance's festival season.",
        long_description="An opening-night gala screening followed by an industry reception. A favorite for film lovers and industry guests — allocations are limited and often move through secondary channels.",
        category="Other Events",
        image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80&auto=format&fit=crop",
        date="2027-01-21", time="6:00 PM", venue="Eccles Theatre", address="1750 Kearns Blvd",
        city="Park City, UT", country="USA", latitude=40.6468, longitude=-111.4978, starting_price=None, tickets_available=0,
        status="request", featured=False,
    ),
    dict(
        id="evt-011", name="The Lion King", slug="the-lion-king-musical",
        description="Disney's award-winning musical, live on stage.",
        long_description="A visually stunning adaptation of the beloved animated film, featuring elaborate puppetry, costuming, and a live orchestra. A strong pick for family outings and first-time theatregoers.",
        category="Family Events",
        image="https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80&auto=format&fit=crop",
        date="2026-12-05", time="2:00 PM", venue="Pantages Theatre", address="6233 Hollywood Blvd",
        city="Los Angeles, CA", country="USA", latitude=34.1016, longitude=-118.3257, starting_price=89, tickets_available=71,
        status="on-sale", featured=False,
    ),
    dict(
        id="evt-012", name="Austin City Limits Music Festival", slug="austin-city-limits",
        description="A weekend of indie, electronic, and hip-hop acts.",
        long_description="A multi-stage festival at Zilker Park featuring a lineup that spans indie rock, electronic, and hip-hop. Single-day and weekend passes are both available.",
        category="Festivals",
        image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80&auto=format&fit=crop",
        date="2027-10-01", time="2:00 PM", venue="Zilker Park", address="2100 Barton Springs Rd",
        city="Austin, TX", country="USA", latitude=30.2669, longitude=-97.7729, starting_price=165, tickets_available=210,
        status="on-sale", featured=False,
    ),
]


def seed_if_empty():
    if Category.query.first() is None:
        for name in DEFAULT_CATEGORIES:
            db.session.add(Category(name=name))

    if Event.query.first() is None:
        for data in DEFAULT_EVENTS:
            db.session.add(Event(**data))

    db.session.commit()
