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
    var basement_entered_at: u64 = 0;

    for (chars, 0..) |char, i| {
        floors += switch (char) {
            '(' => 1,
            ')' => -1,
            else => 0,
        };
        if (floors == -1 and basement_entered_at == 0) {
            basement_entered_at = 1 + i;
        }
    }

    // print content
    std.debug.print("{d}, {d}\n", .{ floors, basement_entered_at });
}
