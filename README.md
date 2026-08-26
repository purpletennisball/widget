# Widgety

Add widgets to your Obsidian notes.

## Widgets

The available widgets are:

- **weight**: Track and visualize weight data with optional highlighting of gains/losses.
- **weight-pill**: A compact version of the weight widget.
- **month**: Display a monthly calendar view.
- **grid**: Create a grid layout to arrange multiple widgets.
- **today**: Show the current date.

## Installation

### Obsidian Community Plugins 

Currently the plugin is not available for download within Obsidian.

### BRAT

1. Install BRAT from the Community Plugins in Obsidian.
2. Run **BRAT: Add a beta plugin for testing** in the command pallete
3. Input `purpletennisball/widgety`
4. After BRAT confirms the installation, in Settings go to the Community plugins tab.
5. Refresh the list of plugins
6. Find Widgety and enable it.

## Usage

To add a widget to your note, use a code block with the language `widgety`:

\`\`\`widgety
widget-name-here
\`\`\`

Replace `widget-name-here` with the name of the widget you want to use. Some widgets accept additional options:

### Weight Widget Options

- `date YYYY-MM-DD`: Specify a date for the weight entry. Useful for daily notes.

Example:

\`\`\`widgety
weight
date 2024-01-15
\`\`\`

### Grid Widget

The grid widget allows you to arrange other widgets in a grid. Specify child widgets separated by blank lines:

\`\`\`widgety
grid
weight
date 2024-01-15

timer
\`\`\`

## Development

1. Clone the repository:
```
git clone https://github.com/purpletennisball/widgety.git
cd widgety
```
2. Install dependencies:
```
npm i
```
3. Start development mode:
```
npm run dev
```
This will watch for changes and rebuild the plugin.

### Building for Production

```
npm run build
```

## License

Widgety is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Widgety is created and maintained by [purpletennisball](https://github.com/purpletennisball).

## Acknowledgements

- Built for [Obsidian](https://obsidian.md).
- Uses [Svelte](https://svelte.dev) for UI components.
- Icons from [Lucide](https://lucide.dev).