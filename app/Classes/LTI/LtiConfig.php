<?php

namespace App\Classes\LTI;
use DOMDocument;

class LtiConfig {

    private $appUrl;
    private $environment;
    private $domainUrl;
    private $launchUrl;
    private $navUrl;
    private $selectUrl;
    private $titleText;

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    public function __construct()
    {
        $this->appUrl = env('APP_URL');
        $this->environment = env('APP_ENV');
        $this->domainUrl = $this->appUrl;
        $this->launchUrl = $this->appUrl . '/index.php/assessment';
        $this->navUrl = $this->appUrl . '/index.php/home';
        $this->selectUrl = $this->appUrl . '/index.php/select';
        $this->titleText = 'Quick Check';
        if ($this->environment !== 'prod') {
            //for alternate environments, add environment name in parentheses to title
            $this->titleText .= ' (' . $this->environment . ')';
        }
    }

    /**
    * Master function to return a config XMl file
    *
    * @return DOMDocument
    */

    public function createConfigFile()
    {
        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $cartridge = $this->createCartridge($doc);
        $this->addBasicInfo($doc, $cartridge);
        $custom = $this->addCustomLaunchVars($doc, $cartridge);
        $extensions = $this->addExtensions($doc, $cartridge);
        $this->addFinalCartridgeInfo($doc, $cartridge);

        $xmlOutput = $doc->saveXML();
        return $xmlOutput;
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Add extension for Canvas to define assignment select component
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $extensions
    * @return void
    */

    private function addAssignmentExtension($doc, $extensions)
    {
        $assignment = $extensions->appendChild($doc->createElement('lticm:options'));
        $this->addAttribute($doc, 'name', 'assignment_selection', $assignment);

        $assignmentProperties = [
            'message_type' => 'ContentItemSelectionRequest',
            'url' => $this->selectUrl,
            'selection_width' => '550',
            'selection_height' => '650'
        ];

        foreach($assignmentProperties as $name => $value) {
            $element = $assignment->appendChild($doc->createElement('lticm:property', $value));
            $this->addAttribute($doc, 'name', $name, $element);
        }
    }

    /**
    * Much easier to write one line for a function call than the 3 lines required
    * just to add a single attribute to an xml node...curse you, xml!
    *
    * @param  []  $assessments
    * @return void
    */

    private function addAttribute($doc, $attrName, $attrValue, $parent)
    {
        $newAttr = $doc->createAttribute($attrName);
        $newAttr->value = $attrValue;
        $parent->appendChild($newAttr);
    }

    /**
    * Add basic information such as title, description, etc.
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $cartridge
    * @return void
    */

    private function addBasicInfo($doc, $cartridge)
    {
        $title = $cartridge->appendChild($doc->createElement('blti:title', $this->titleText));

        $descriptionText = 'This tool allows embedding and taking quick checks, as well as reviewing student results through the left nav.';
        $description = $cartridge->appendChild($doc->createElement('blti:description', $descriptionText));
        $icon = $cartridge->appendChild($doc->createElement('blti:icon'));

        $launchUrl = $cartridge->appendChild($doc->createElement('blti:launch_url', $this->launchUrl));
    }

    /**
    * Add custom LTI launch variables needed from Canvas
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $cartridge
    * @return DOMNode
    */

    private function addCustomLaunchVars($doc, $cartridge)
    {
        $custom = $cartridge->appendChild($doc->createElement('blti:custom'));

        $customVars = [
            'custom_canvas_assignment_dueat' => '$Canvas.assignment.dueAt',
            'custom_canvas_course_id' => '$Canvas.course.id',
            'custom_canvas_courseSection_id' => '$CourseSection.sourcedId',
            'custom_canvas_section_id' => '$Canvas.course.sectionIds',
            'custom_canvas_user_id' => '$Canvas.user.id',
            'custom_canvas_user_login_id' => '$Canvas.user.loginId'
        ];

        foreach ($customVars as $varName => $customVar) {
            $element = $custom->appendChild($doc->createElement('lticm:property', $customVar));
            $this->addAttribute($doc, 'name', $varName, $element);
        }

        return $custom;
    }

    /**
    * Add custom Canvas extensions for nav, assignment selection, etc.
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $cartridge
    * @return DOMNode
    */

    private function addExtensions($doc, $cartridge)
    {
        $extensions = $this->addExtensionsNode($doc, $cartridge);
        $this->addNavExtension($doc, $extensions);
        $this->addAssignmentExtension($doc, $extensions);
        $this->addLinkExtension($doc, $extensions);
        return $extensions;
    }

    /**
    * Add extensions node for Canvas
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $cartridge
    * @return DOMNode
    */

    private function addExtensionsNode($doc, $cartridge)
    {
        $extensions = $cartridge->appendChild($doc->createElement('blti:extensions'));
        $this->addAttribute($doc, 'platform', 'canvas.instructure.com', $extensions);

        $extensionProperties = [
            'tool_id' => 'iu-eds-quickcheck',
            'privacy_level' => 'public',
            'domain' => $this->domainUrl
        ];

        foreach($extensionProperties as $name => $value) {
            $element = $extensions->appendChild($doc->createElement('lticm:property', $value));
            $this->addAttribute($doc, 'name', $name, $element);
        }

        return $extensions;
    }

    /**
    * Add cartridge_bundle and cartridge_icon
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $cartridge
    * @return void
    */

    private function addFinalCartridgeInfo($doc, $cartridge)
    {
        $bundle = $cartridge->appendChild($doc->createElement('cartridge_bundle'));
        $this->addAttribute($doc, 'identifierref', 'BLTI001_Bundle', $bundle);
        $cartridge_icon = $cartridge->appendChild($doc->createElement('cartridge_icon'));
        $this->addAttribute($doc, 'identifierref', 'BLTI001_Icon', $cartridge_icon);
    }

    /**
    * Add extension for Canvas to define link selection component (AKA module external tool link)
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $extensions
    * @return void
    */

    private function addLinkExtension($doc, $extensions)
    {
        $link = $extensions->appendChild($doc->createElement('lticm:options'));
        $this->addAttribute($doc, 'name', 'link_selection', $link);

        $linkProperties = [
            'message_type' => 'ContentItemSelectionRequest',
            'url' => $this->selectUrl,
            'selection_width' => '550',
            'selection_height' => '650'
        ];

        foreach($linkProperties as $name => $value) {
            $element = $link->appendChild($doc->createElement('lticm:property', $value));
            $this->addAttribute($doc, 'name', $name, $element);
        }
    }

    /**
    * Add extension for Canvas to define nav component
    *
    * @param  DOMDocument  $doc
    * @param  DOMNode      $extensions
    * @return void
    */

    private function addNavExtension($doc, $extensions)
    {
        $nav = $extensions->appendChild($doc->createElement('lticm:options'));
        $this->addAttribute($doc, 'name', 'course_navigation', $nav);

        $navProperties = [
            'url' => $this->navUrl,
            'text' => $this->titleText,
            'default' => 'disabled',
            'enabled' => 'true'
        ];

        foreach($navProperties as $name => $value) {
            $element = $nav->appendChild($doc->createElement('lticm:property', $value));
            $this->addAttribute($doc, 'name', $name, $element);
        }
    }

    /**
    * Create cartridge parent tag
    *
    * @param  DOMDocument  $doc
    * @return DOMNode
    */

    private function createCartridge($doc)
    {
        $cartridge = $doc->appendChild($doc->createElement('cartridge_basiclti_link'));
        $this->addAttribute($doc, 'xmlns', 'http://www.imsglobal.org/xsd/imslticc_v1p0', $cartridge);
        $this->addAttribute($doc, 'xmlns:blti', 'http://www.imsglobal.org/xsd/imsbasiclti_v1p0', $cartridge);
        $this->addAttribute($doc, 'xmlns:lticm', 'http://www.imsglobal.org/xsd/imslticm_v1p0', $cartridge);
        $this->addAttribute($doc, 'xmlns:lticp', 'http://www.imsglobal.org/xsd/imslticp_v1p0', $cartridge);
        $this->addAttribute($doc, 'xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance', $cartridge);
        $this->addAttribute($doc, 'xsi:schemaLocation', 'http://www.imsglobal.org/xsd/imslticc_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd http://www.imsglobal.org/xsd/imslticm_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd http://www.imsglobal.org/xsd/imslticp_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd', $cartridge);

        return $cartridge;
    }
}