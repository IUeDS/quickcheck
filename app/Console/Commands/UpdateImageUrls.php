<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:update-images {old_url} {new_url}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates old image URLs to new URLs in specified columns.
                             Example: php artisan db:update-images "old.s3.url" "new.cloudfront.url"';

    /**
     * An array of table and column pairs to be updated.
     *
     * @var array
     */
    protected $updateColumns = [
        'questions' => 'question_text',
        'mc_answers' => 'answer_text',
        'question_feedback' => 'feedback_text',
        'mc_option_feedback' => 'feedback_text',
    ];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $oldDomain = $this->argument('old_url');
        $newDomain = $this->argument('new_url');

        $this->info("Starting URL update from '{$oldDomain}' to '{$newDomain}'...");

        foreach ($this->updateColumns as $table => $column) {
            $this->line("Processing table '{$table}' and column '{$column}'...");

            try {
                $query = DB::table($table)
                    ->where($column, 'like', '%' . $oldDomain . '%');

                // Get the count of records that will be updated
                $count = $query->count();

                if ($count > 0) {
                    $this->info("Found {$count} records to update.");

                    // Perform the update
                    $updated = $query->update([
                        $column => DB::raw("REPLACE({$column}, '{$oldDomain}', '{$newDomain}')")
                    ]);

                    $this->info("Successfully updated {$updated} records in '{$table}'->'{$column}'.");
                } else {
                    $this->comment("No records found with the old URL in '{$table}'->'{$column}'.");
                }
            } catch (\Exception $e) {
                $this->error("An error occurred while processing '{$table}'->'{$column}':");
                $this->error($e->getMessage());
            }
        }

        $this->info("Database update complete!");
        return 0;
    }
}