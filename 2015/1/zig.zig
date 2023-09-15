const std = @import("std");

pub fn main() !void {
    // open file
    const file = try std.fs.cwd().openFile("input.txt", .{ .mode = .read_only });

    // allocate buffer size to file size
    const file_size = (try file.stat()).size;
    const chars: []u8 = try std.heap.page_allocator.alloc(u8, file_size);

    // read file into buffer
    try file.reader().readNoEof(chars);

    // calc floors
    var floors: i64 = 0;

    for (chars) |char| {
        floors += switch (char) {
            '(' => 1,
            ')' => -1,
            else => 0,
        };
    }

    // print content
    std.debug.print("{d}\n", .{floors});
}
