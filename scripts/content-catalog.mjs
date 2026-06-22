/** Shared piece + series metadata for sync and validation scripts. */
export const astronautDreams = [
	{
		id: 'astronaut-dreams-01',
		key: 'anotherastronaught',
		title: 'Cliffside Watch',
		alt: 'Astronaut on a grassy cliff overlooking calm water toward the horizon',
	},
	{
		id: 'astronaut-dreams-02',
		key: 'spaceman',
		title: 'Earth in Visor',
		alt: 'Black and white astronaut helmet with Earth reflected in the visor',
	},
	{
		id: 'astronaut-dreams-03',
		key: 'cloud_space_man',
		title: 'Cloud Harbor',
		alt: 'Astronaut helmet floating in the ocean beneath a massive cloud',
	},
	{
		id: 'astronaut-dreams-04',
		key: 'non_dustty',
		title: 'Dust Wake',
		alt: 'Astronaut standing on rolling desert dunes with a trailing tether',
	},
	{
		id: 'astronaut-dreams-05',
		key: 'astroroom2',
		title: 'Abandoned Chamber',
		alt: 'Astronaut helmet on the floor of a dark industrial room lit by a sunbeam',
		process: ['astroroom2', 'spaceman', 'anotherastronaught', 'non_dustty', 'cloud_space_man', 'smallman'],
	},
	{
		id: 'astronaut-dreams-06',
		key: 'red_halo',
		title: 'Red Halo',
		alt: 'Small astronaut before a towering shrouded figure and a glowing red ring',
	},
	{
		id: 'astronaut-dreams-07',
		key: 'untitled',
		title: 'Golden Horizon',
		alt: 'Lone figure on reflective water at sunset beneath a vast golden sky',
	},
	{
		id: 'astronaut-dreams-08',
		key: 'spacemanincave',
		title: 'Cave Threshold',
		alt: 'Astronaut framed in a rocky cave opening overlooking water and clouds',
	},
	{
		id: 'astronaut-dreams-09',
		key: 'spacemaninwater',
		title: 'Open Water',
		alt: 'Astronaut standing waist-deep in choppy ocean water facing the viewer',
	},
	{
		id: 'astronaut-dreams-10',
		key: 'eevee_next_cave',
		title: 'Gothic Portal',
		alt: 'Astronaut approaching a gothic stone arch carved into a sunlit cliff',
	},
	{
		id: 'astronaut-dreams-11',
		key: 'smallman',
		title: 'Violet Architecture',
		alt: 'Tiny figure before a massive translucent purple sculptural structure',
	},
	{
		id: 'astronaut-dreams-12',
		key: 'moodycity',
		title: 'Submerged Tower',
		alt: 'Astronaut wading toward a lit doorway at the base of a colossal tower in dark water',
	},
];

export const otherWorks = [
	{
		id: 'other-01',
		key: 'generative_growth',
		title: 'Generative Growth',
		alt: 'Translucent crystalline floral forms in pink, white, and violet',
	},
	{
		id: 'other-02',
		key: 'religionpart2',
		title: 'Sacred Geometry',
		alt: 'Figure in a suit beneath a glowing halo surrounded by enormous hands in orange fog',
	},
];

export const allAssetKeys = [
	...new Set([
		...astronautDreams.map((p) => p.key),
		...otherWorks.map((p) => p.key),
		...astronautDreams.flatMap((p) => p.process ?? []),
	]),
];
