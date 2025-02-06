<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\Collection;
use App\Models\User;

class TestController extends Controller
{
    /**
    * Refresh the DB (remove all data and reseed)
    *
    * @param  None 
    * @return Response
    */

    public function refresh(Request $request)
    {
        $this->refreshDatabase();
        return response()->success();
    }

    /**
    * Create a new set with the test instructor added as a user
    *
    * @param  string  $name 
    * @param  string  $description
    * @return Response
    */

    public function newSet(Request $request)
    {
        $this->refreshDatabase();

        $name = $request->input('name');
        $description = $request->input('description');
        $username = 'testinstructor';
        $user = User::getUserFromUsername($username);
        $collection = new Collection();
        $collection->storeCollection($name, $user, $description);

        return response()->success();
    }

    /**
    * Create a new set/subset/quick check with the test instructor added as a user
    *
    * @param  None 
    * @return Response
    */

    public function newAssessment(Request $request)
    {
        return response()->success();
    }

    /**
    * Create a new set with all test quick checks added for a user to take
    *
    * @param  None 
    * @return Response
    */

    public function testAssessments(Request $request)
    {
        return response()->success();
    }

    /**
    * Programatically refresh the database and reseed
    *
    * @param  None 
    * @return None
    */

    private function refreshDatabase()
    {
        Artisan::call('migrate:fresh --seed'); 
    }
}
